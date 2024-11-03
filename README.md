# Nodejs Backend E-commerce
## Introduction
  An e-commerce application built using Node.js and MongoDB to manage users, products, shopping carts, and coupons.

## Features
+ User Management: signup, login, forgot password, reset password, logout, and handle refresh tokens.

+ Product Management: search products, create, delete, update, publish, unpublish products, and list published and unpublished products.

+ Shopping Cart Management: add products to the cart, remove products from the cart, update product quantities in the cart, and view the cart.

+ Coupon Management: get coupons, list all coupons, apply coupons, create, update, and delete coupons.

## Requirements
+ Node.js: Version v20.18.0 or higher (recommended)

+ MongoDB: Running on default port (27017)

## Installation Instructions:
1. Clone the repository:
```
    git clone https://github.com/TxZer0/Nodejs_Backend_E-commerce.git
    cd Nodejs_Backend_E-commerce
```

2. Install the dependencies:
```
    npm i 
```

3. Configure environment variables: (Replace the placeholders with your own values)
```
    APP_NAME=Ecommerce
    HOST=localhost
    PORT=8080

    API_KEY=your_api_key_here
    ACCESS_TOKEN_SECRET=your_access_token_secret_here
    REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
    RESET_SECRET=your_reset_secret_here

    DEV_DB_HOST=your_db_host_here
    DEV_DB_PORT=27017
    DEV_DB_NAME=your_db_name_here

    EMAIL_USER=your_email_here
    EMAIL_PASS=your_email_password_here
```

4. Run the application:
```
    npm start
```

### Contact:
  Feel free to reach out with any questions or feedback!  
  Email: laithanhtaeh190@gmail.com

