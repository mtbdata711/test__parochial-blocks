# Parochial Blocks

An overengineered and dated solution for rendering components for multiple platforms (CMS / PHP / Client).

Not quite universal. 

Including:

 - Handlebars JS + PHP
 - Storybook
 - Web Components

## Quick start

Open in devcontainer and run:

    cd plugin && composer install
    cd .. && nvm install && npm install && npm run storybook

To compile assets run:

    npm run php:compile
