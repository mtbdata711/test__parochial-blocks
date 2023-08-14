FROM php:7.3-apache

COPY .devcontainer/default.conf /etc/apache2/sites-enabled/000-default.conf

RUN a2enmod rewrite

WORKDIR /var/www/html

# install and enable json extension
RUN docker-php-ext-install json && docker-php-ext-enable json

#Xdebug install

RUN pecl install "xdebug-3.1.5" \
    && docker-php-ext-enable xdebug

ENV XDEBUG_PORT 9000
ENV XDEBUG_IDEKEY docker

RUN echo "xdebug.remote_enable=1" >> /usr/local/etc/php/conf.d/xdebug.ini && \
    echo "xdebug.remote_autostart=1" >> /usr/local/etc/php/conf.d/xdebug.ini && \
    echo "xdebug.remote_port=${XDEBUG_PORT}" >> /usr/local/etc/php/conf.d/xdebug.ini && \
    echo "xdebug.idekey=${XDEBUG_IDEKEY}" >> /usr/local/etc/php/conf.d/xdebug.ini

# install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# install nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash


# install git
RUN apt-get update && apt-get install -y git

CMD ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]

EXPOSE 80