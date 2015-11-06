电竞项目
=======
Code Name: Tron

安装及启动步骤
------------
1. 配置本地开发环境（Nginx、MySQL、PHP、Redis）
   Windows: WAMP, Redis
   Mac: http://blog.frd.mn/install-nginx-php-fpm-mysql-and-phpmyadmin-on-os-x-mavericks-using-homebrew/
   Linux: 自行根据所用的系统安装
2. 安装composer
3. clone本项目到本地
4. 在项目根目录运行 composer install
5. 执行 php app/console doctrine:database:create 创建数据库
6. 执行 php app/console doctrine:schema:update --force 创建表结构
7. 向其他开发或者系统运维要一份线上数据库导入到本地数据库
8. 安装nodejs
9. 安装gulp：npm install -g gulp --save-dev
10. 安装npm包：npm install
11. 运行gulp