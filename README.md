yapdnsui
========

*Yet Another PowerDNS web interface*

The ultimate goal is to produce a slick web interface to PowerDNS that
will let you do add/remove/update domains and records in your PowerDNs
instance via PowerDNs API.
You can also see the live configuration and live statistics for demonstration purporse.

![yapdnsui_livestats]
(https://github.com/leucos/pdnsui/raw/master/misc/screenshot_livestats.png)

![yapdnsui_config]
(https://github.com/leucos/pdnsui/raw/master/misc/screenshot_config.png)

![yapdnsui_domains]
(https://github.com/leucos/pdnsui/raw/master/misc/screenshot_domains.png)

![yapdnsui_records]
(https://github.com/leucos/pdnsui/raw/master/misc/screenshot_records.png)

yapdnsui Prereqs
----------------

You need [NodeJS](http://nodejs.org) v0.10.x+ for this application to work.

PowerDNs Prereqs
----------------

You need to enable the [PowerDNS API](https://github.com/PowerDNS/pdnsapi) on your PowerDNs instances.

Configure as follows:
```
webserver=yes
webserver-address=127.0.0.1
webserver-port=8081
webserver-password=changeme
experimental-json-interface=yes
```

* Restart
```bash
```

* Test
```bash
```

Installing
----------

* Clone the repository

```bash
git clone https://leucos@github.com/xbgmsharp/yapdnsui.git
cd yapdnsui
```

* Install dependencies

```bash
npm install
```

* Start the application 

```bash
PORT=8080 DEBUG=yapdnsui node bin/www
```

* Point your browser to: [http://localhost:8080/] (http://localhost:8080/)
* Enjoy!

_Note_ : you don't need to configure anything. yaPDNSui directly talk to the PowerDNS. You need a PowerDNS server try this out.

Test using Docker
-----------------

* Install Docker
[Install documentation of Docker](https://docs.docker.com/installation/)

The deb package are valid for Ubuntu and Debian.

```bash
$ cat > /etc/apt/sources.list.d/docker.list
deb http://get.docker.io/ubuntu docker main
$ apt-get update && apt-get install lxc-docker
```

* Build the images
The build process might take some time while it download the origin nodejs image.

```bash
docker build --rm=true --no-cache=true -t xbgmsharp/yapdnsui github.com/xbgmsharp/yapdnsui.git
or
docker build --rm=true --no-cache=true -t xbgmsharp/yapdnsui
```

* Run the container
```bash
docker run -d -p 8080:8080 -t xbgmsharp/yapdnsui
or
docker run -i --rm -p 8080:8080 -t xbgmsharp/yapdnsui /bin/bash
```

* check the IP
```bash
docker ps -a
docker inspect CONTAINER_ID | grep IPA
```

* Login in the container via SSH
user is root and password is admin
```bash
$ ssh root@172.17.0.x
```

* Review logs
```bash
# docker logs CONTAINER_ID
  yapdnsui Express server listening on port 8080 +0ms
```

* Point your browser to: [http://172.17.0.x:8080/] (http://172.17.0.x:8080/)
* Enjoy!

If the application crash. The container exit.
You can fillup an issue and add the backtrace or you fix it.
From a SSH shell, you can restart the application.

Secure yapdnsui
---------------

For security reasons, you may want to run a webserver (like Apache or nginx) in front as a reverse proxy using SSL.

You can read this [HOWTO](http://blog.nachtarbeiter.net/2010/02/16/monitoring-powerdns-via-the-internal-web-server/) to see how.

For security reasons, you probably want to use the same webserver for authentication.

You can read this [mod_auth_ldap - Apache HTTP Server](httpd.apache.org/docs/2.0/mod/mod_auth_ldap.html)

E.g. you might want use a SSL connection and authenticate your co-workers using the internal LDAP or database server of your company intranet.

Contributing to yapdnsui
----------------------

* Check out the latest master to make sure the feature hasn't been implemented or the bug hasn't been fixed yet
* Check out the issue tracker to make sure someone already hasn't requested it and/or contributed it
* Fork the project
* Use a specific branch for your changes (one bonus point if it's prefixed with 'feature/') 
* _write tests_, doc, commit and push until you are happy with your contribution
* Send a pull request
* Please try not to mess with the Rakefile, version, or history

License
-------

This program is free software; you can redistribute it and/or modify it under the terms of the [GNU General Public License](http://www.gnu.org/licenses/gpl.html) as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program comes without any warranty.

Credits
-------

- yaPDNSui is built with the awesome [NodeJS](http://nodejs.org) and [Express](http://expressjs.com).

- Graph [http://www.highcharts.com/] (http://www.highcharts.com/)

- Layout & CSS: [http://twitter.github.com/bootstrap/] (http://twitter.github.com/bootstrap/)

- Favicon from: [http://glyphicons.com/] (http://glyphicons.com/)

- Apple touch icon from: [http://findicons.com/search/leaf] (http://findicons.com/search/leaf)

- PowerDNS [http://www.powerdns.com/] (http://www.powerdns.com/)

- Thansk to PDNSui [https://github.com/leucos/pdnsui/] (https://github.com/leucos/pdnsui/)
