#!/bin/bash

# Docker Development Environment Management Script
# Usage: ./scripts/docker-dev.sh [command]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed and running
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! docker info &> /dev/null; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
}

# Build all services
build() {
    print_status "Building Docker images for development..."
    docker-compose -f docker-compose.dev.yml build
    print_success "Docker images built successfully!"
}

# Start all services
up() {
    print_status "Starting Airbar development environment..."
    docker-compose -f docker-compose.dev.yml up -d
    print_success "Services started! Access the application at:"
    echo "  - Web: http://localhost:3000"
    echo "  - API: http://localhost:3001"
    echo "  - PgAdmin: http://localhost:5050 (with --profile admin)"
}

# Stop all services
down() {
    print_status "Stopping all services..."
    docker-compose -f docker-compose.dev.yml down
    print_success "All services stopped!"
}

# Restart all services
restart() {
    print_status "Restarting services..."
    down
    up
}

# Show logs
logs() {
    if [ -z "$2" ]; then
        docker-compose -f docker-compose.dev.yml logs -f
    else
        docker-compose -f docker-compose.dev.yml logs -f "$2"
    fi
}

# Show status
status() {
    print_status "Service status:"
    docker-compose -f docker-compose.dev.yml ps
}

# Clean up (remove containers, volumes, images)
clean() {
    print_warning "This will remove all containers, volumes, and images. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Cleaning up..."
        docker-compose -f docker-compose.dev.yml down -v --rmi all
        docker system prune -f
        print_success "Cleanup completed!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Database operations
db_migrate() {
    print_status "Running database migrations..."
    docker-compose -f docker-compose.dev.yml exec -T api pnpm --filter @airbar/db db:migrate
    print_success "Database migrations completed!"
}

db_seed() {
    print_status "Seeding database..."
    docker-compose -f docker-compose.dev.yml exec -T api pnpm --filter @airbar/db db:seed
    print_success "Database seeded successfully!"
}

db_push() {
    print_status "Pushing database schema..."
    docker-compose -f docker-compose.dev.yml exec -T api pnpm --filter @airbar/db db:push
    print_success "Database schema pushed successfully!"
}

db_generate() {
    print_status "Generating Prisma client..."
    docker-compose -f docker-compose.dev.yml exec -T api pnpm --filter @airbar/db db:generate
    print_success "Prisma client generated successfully!"
}

db_studio() {
    print_status "Opening Prisma Studio..."
    docker-compose -f docker-compose.dev.yml exec api pnpm --filter @airbar/db db:studio
}

db_reset() {
    print_warning "This will reset the database and seed it with fresh data. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Resetting database..."
        docker-compose -f docker-compose.dev.yml exec -T api pnpm --filter @airbar/db db:push --force-reset
        docker-compose -f docker-compose.dev.yml exec -T api pnpm --filter @airbar/db db:seed
        print_success "Database reset completed!"
    else
        print_status "Database reset cancelled."
    fi
}

# Show help
help() {
    echo "Airbar Docker Development Environment"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  build       Build all Docker images"
    echo "  up          Start all services"
    echo "  down        Stop all services"
    echo "  restart     Restart all services"
    echo "  logs        Show logs for all services (or specify service name)"
    echo "  status      Show service status"
    echo "  clean       Remove all containers, volumes, and images"
    echo "  db:migrate  Run database migrations"
    echo "  db:seed     Seed database with sample data"
    echo "  db:push     Push database schema changes"
    echo "  db:generate Generate Prisma client"
    echo "  db:studio   Open Prisma Studio"
    echo "  db:reset    Reset database and seed with fresh data"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 up                 # Start development environment"
    echo "  $0 logs api           # Show API logs"
    echo "  $0 logs web           # Show Web logs"
}

# Main command processing
case "$1" in
    build)
        check_docker
        build
        ;;
    up)
        check_docker
        up
        ;;
    down)
        check_docker
        down
        ;;
    restart)
        check_docker
        restart
        ;;
    logs)
        check_docker
        logs "$@"
        ;;
    status)
        check_docker
        status
        ;;
    clean)
        check_docker
        clean
        ;;
    db:migrate)
        check_docker
        db_migrate
        ;;
    db:seed)
        check_docker
        db_seed
        ;;
    db:push)
        check_docker
        db_push
        ;;
    db:generate)
        check_docker
        db_generate
        ;;
    db:studio)
        check_docker
        db_studio
        ;;
    db:reset)
        check_docker
        db_reset
        ;;
    help|--help|-h)
        help
        ;;
    *)
        if [ -z "$1" ]; then
            print_error "No command specified."
        else
            print_error "Unknown command: $1"
        fi
        echo ""
        help
        exit 1
        ;;
esac