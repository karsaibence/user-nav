# Alap PHP 8.2 image használata
FROM php:8.2-fpm
WORKDIR /var/www/html
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \   
    libxml2-dev \
    zip \
    unzip


RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd

# Dockerfile-ban PHP-FPM konfiguráció módosítása


RUN curl -o /usr/local/bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh \
    && chmod +x /usr/local/bin/wait-for-it.sh


COPY . /var/www/html
RUN composer install

CMD /usr/local/bin/wait-for-it.sh db:3306 -- php artisan migrate:fresh --seed --force && php-fpm
# CMD php artisan serve --host=0.0.0.0 --port=8000
EXPOSE 9000

