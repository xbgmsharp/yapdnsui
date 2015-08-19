yapdnsui
========

*Yet Another PowerDNS web interface*

Test using Docker
-----------------

* Install Docker
[Install documentation of Docker](https://docs.docker.com/installation/)

The Docker deb package are valid for Ubuntu and Debian.

```bash
$ wget http://get.docker.io/ -O - | sh
```
Or
```bash
echo deb https://get.docker.io/ubuntu docker main > /etc/apt/sources.list.d/docker.list
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 36A1D7869245C8950F966E92D8576A8BA88D21E9
apt-get update && apt-get install -y lxc-docker
```

* Build the images

The following command build the build directly from the github repository.

The build process might take some time a while as it download the origin nodejs docker image.
```bash
$ docker build --rm=true --no-cache=true -t xbgmsharp/yapdnsui github.com/xbgmsharp/yapdnsui.git
```

Alternatively, you can build the image localy after cloning the repository.
```bash
$ docker build --rm=true --no-cache=true -t xbgmsharp/yapdnsui .
```

* Run the container

Run as a detach container
```bash
$ docker run -d -p 22:22 -p 8080:8080 -t xbgmsharp/yapdnsui
```

Or run the container with an attach shell
```
$ docker run -i --rm -p 22:22 -p 8080:8080 -t xbgmsharp/yapdnsui /bin/bash
```

* Check the IP

```bash
$ docker ps -a
$ docker inspect CONTAINER_ID | grep IPA
```

Or both command in one
```bash
$ docker ps -a | grep yapdnsui  | awk '{print $1}' | xargs docker inspect | grep IPAddress
```

Or all in one with the ssh connection
```bash
$ ssh $(docker ps -a | grep yapdnsui  | awk '{print $1}' | xargs docker inspect | grep IPAddress | awk '{print $2}' | tr -d '"' | tr -d ',' )
```

* Login in the container via SSH

User is root and password is admin.

```bash
$ ssh root@172.17.0.x
```

* Review logs
```bash
$ docker logs CONTAINER_ID
  yapdnsui Express server listening on port 8080 +0ms
```

* Point your browser to: [http://172.17.0.x:8080/](http://172.17.0.x:8080/)
* Enjoy!

If the application crash. The container exit.
From a SSH shell, you can restart the application.
You can fillup an issue and add the backtrace or you fix it.

Secure yapdnsui
---------------

For security reasons, you may want to run a webserver (like Apache or nginx) in front of your PowerDNS webserver as a reverse proxy using SSL.
As a best pratice, it is recommended to apply use SSL for the traffic between the end-user and the application.

You can read this [HOWTO](http://blog.nachtarbeiter.net/2010/02/16/monitoring-powerdns-via-the-internal-web-server/) to see how.

For security reasons, you probably want to use the same webserver for authentication purpose.

You can read this [mod_auth_ldap - Apache HTTP Server](httpd.apache.org/docs/2.0/mod/mod_auth_ldap.html)

E.g. you might want use a SSL connection and authenticate your co-workers using the internal LDAP or database server of your company intranet.

