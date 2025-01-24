# Laravel Dockerfile
FROM php:8.2-fpm

# Laravel dependencies
RUN apt-get update && apt-get install -y libpng-dev libjpeg-dev libfreetype6-dev zip git && \
    docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install gd pdo pdo_mysql

# Install Composer (PHP package manager)
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set working directory
WORKDIR /var/www

# Copy Laravel files
COPY . /var/www

# Install Laravel dependencies
RUN composer install

# Expose port
EXPOSE 8000

# Start PHP-FPM server
CMD ["php-fpm"]
