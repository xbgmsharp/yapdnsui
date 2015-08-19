yapdnsui
========

*Yet Another PowerDNS web interface*

The ultimate goal is to produce a slick web interface to [PowerDNS](http://www.powerdns.com/) that
will let you fully operate your PowerDNS instance via the official [PowerDNS API](https://github.com/PowerDNS/pdnsapi).

The application should let you do add/delete/update domains and records as well as graph
statistics and list/update configuration items **LIVE** from one or multiple PowerDNS instance via the PowerDNS API.

In addition, the application should let you manage DNSSEC zones and zone metadata.

It is not just another PowerDNS UI, it is the first to use the [PowerDNS API](https://github.com/PowerDNS/pdnsapi), therefor to be backend-agnostic and DNSSEC aware.

Currently, you can list the configuration and see live statistics in a graph and list all the domains and records for demonstration purpose.

You can checkout the web interface using the [live demo](http://yapdnsui-xbgmsharp.rhcloud.com/) running on OpenShift cloud.

You are welcome to contribute.

![yapdnsui_livestats]
(https://github.com/xbgmsharp/yapdnsui/raw/master/misc/screenshot_livestats.png)

![yapdnsui_config]
(https://github.com/xbgmsharp/yapdnsui/raw/master/misc/screenshot_config.png)

![yapdnsui_domains]
(https://github.com/xbgmsharp/yapdnsui/raw/master/misc/screenshot_domains.png)

![yapdnsui_records]
(https://github.com/xbgmsharp/pdnsui/raw/master/misc/screenshot_records.png)

yapdnsui Prereqs
----------------

You need [NodeJS](http://nodejs.org) v0.10.x+ for this application to work.

It might work with lower requirements but I didn't test.

PowerDNS Prereqs
----------------
Yes, you need a [PowerDNS](http://www.powerdns.com/) server.

It can be either an [Authoritative](https://doc.powerdns.com/md/authoritative/) or a [Recursor](https://doc.powerdns.com/md/recursor/) to try this application out.

You need to enable the [PowerDNS API](https://doc.powerdns.com/md/httpapi/README/) on your PowerDNS instances.

For an Authoritative instance, configure as follows:
```
# Allow webserver 
webserver=yes
# IP Address of web server to listen on
webserver-address=127.0.0.1
# Port of web server to listen on
webserver-port=8081
# Web server access is only allowed from these subnets
webserver-allow-from=0.0.0.0/0,::/0
# Enable JSON and API
experimental-json-interface=yes
experimental-api-key=changeme
```

* Restart
```bash
$ /etc/init.d/pdns restart
```

* Test
```bash
$ curl -v -H 'X-API-Key: changeme' http://localhost:8081/
```

Installing
----------

* Clone the repository

```bash
git clone https://github.com/xbgmsharp/yapdnsui
cd yapdnsui
```

* Install dependencies

```bash
$ npm install
```

```bash
$ bower install
```

* Start the application 

```bash
$ npm start
```
Or manually, you can define an IP and the PORT by using environment variables.
```bash
$ HOST=127.0.0.1 PORT=8080 DEBUG=yapdnsui node bin/www
```

* Point your browser to: [http://localhost:8080/](http://localhost:8080/)
* Enjoy!

_Note_ : yaPDNSui use a sqlite database to store PowerDNS instances details.
You can access the PowerDNS server manage interface using the menu on the right.

Test using Docker
-----------------

You can try yaPDNSui using Docker. Please refer to [Docker.md](Docker.md)


Secure yapdnsui
---------------

For security reasons, you may want to run a webserver (like Apache or Nginx) in front of your PowerDNS webserver as a reverse proxy using SSL.
As a best pratice, it is recommended to apply use SSL for the traffic between the end-user and the application.

You can read this [HOWTO](http://blog.nachtarbeiter.net/2010/02/16/monitoring-powerdns-via-the-internal-web-server/) to see how.

For security reasons, you probably want to use the same webserver for authentication purpose.

You can read this [mod_auth_ldap - Apache HTTP Server](httpd.apache.org/docs/2.0/mod/mod_auth_ldap.html)

E.g. you might want use a SSL connection and authenticate your co-workers using the internal LDAP or database server of your company intranet.

Contributing to yapdnsui
------------------------

* Check out the latest master to make sure the feature hasn't been implemented or the bug hasn't been fixed yet
* Check out the issue tracker to make sure someone already hasn't requested it and/or contributed it
* Fork the project
* Use a specific branch for your changes (one bonus point if it's prefixed with 'feature/') 
* _write tests_, doc, commit and push until you are happy with your contribution
* Send a pull request
* Please try not to mess with the package, version, or history

License
-------

This program is free software; you can redistribute it and/or modify it under the terms of the [GNU General Public License](http://www.gnu.org/licenses/gpl.html) as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program comes without any warranty.

Credits
-------

* yaPDNSui is built with the awesome [NodeJS](http://nodejs.org) and [Express](http://expressjs.com).

* Charts: [http://www.highcharts.com/](http://www.highcharts.com/)

* Layout & CSS: [http://twitter.github.com/bootstrap/](http://twitter.github.com/bootstrap/)

* Favicon from: [http://glyphicons.com/](http://glyphicons.com/)

* Apple touch icon from: [http://findicons.com/search/leaf](http://findicons.com/search/leaf)

* PowerDNS [http://www.powerdns.com/](http://www.powerdns.com/)

* Thanks to PDNSui [https://github.com/leucos/pdnsui/](https://github.com/leucos/pdnsui/)
