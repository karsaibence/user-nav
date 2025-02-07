# Alap PHP 8.2 image használata
FROM php:8.2-fpm

# Composer fájlok másolása
COPY composer.lock composer.json /var/www/

# Munkakönyvtár beállítása
WORKDIR /var/www/html

# Alapcsomagok telepítése
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \   
    libxml2-dev \
    zip \
    unzip

# Composer telepítése
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# PHP kiterjesztések telepítése
RUN docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd

# Wait-for-it script telepítése
RUN curl -o /usr/local/bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh \
    && chmod +x /usr/local/bin/wait-for-it.sh

# Csoport és felhasználó létrehozása
RUN groupadd -g 1000 www
RUN useradd -u 1000 -ms /bin/bash -g www www


COPY . /var/www
# Alkalmazás fájlok másolása a megfelelő jogosultságokkal
COPY --chown=www:www . /var/www/html

# PHP-FPM felhasználó beállítása
USER www

# Composer telepítése és szükséges csomagok telepítése
RUN composer install

# Port megnyitása
EXPOSE 9000

# Alkalmazás elindítása
CMD /usr/local/bin/wait-for-it.sh db:3306 -- php artisan migrate:fresh --seed --force; php-fpm
