*Secure and Monitoring PowerDNS via the internal web server*

There is a secure way to retrieve the information provided by PowerDNS from outside your DNS server host. You could use Apache, nginx or any other web server you like as a proxy server. That way you can use more advanced authentication methods built into that web server to secure your status page. I will now show you how to do this using Apache 2 on Debian. We’ll need mod_proxy, mod_proxy_http and mod_headers enabled on the Apache 2 server. If you do not want to run an instance of Apache 2 on your DNS server, you could use an SSL tunnel or a secure back channel link to a remote Apache server to retrieve the status page. But this is beyond the scope of this post.

First, enable the internal PowerDNS web server by editing the configuration file.

```
    webserver=yes
    webserver-address=127.0.0.1
    webserver-port=8081
    webserver-password=PowerDNS
```

Now install and enable the required modules of Apache 2 by executing the following commands.

```
    $ apt-get install libapache2-mod-proxy-html
    $ a2enmod proxy
    $ a2enmod proxy_http
    $ a2enmod headers
```

The last module is only needed, if you set a password for your internal web server as recommended above. I assume that you’ve got some kind of virtual host configuration for your Apache server. You’ll want to add a new virtual host for the DNS status information. If you use a subdirectory, navigation might be a bit odd. Let’s add a new site to the available sites.

```
    $ vi /etc/apache2/sites-available/status.dns.example.net
    <VirtualHost 192.168.0.1:80>
            ServerName status.dns.example.net
            DocumentRoot /var/www/
            ProxyRequests Off
            <proxy *>
                   Order deny,allow
                   Allow from all
                    ForceType 'text/html; charset=UTF-8'
            </proxy>
            ProxyPass / http://localhost:8081
            ProxyPassReverse / http://localhost:8081
    </VirtualHost>
```

Alright, so what are we doing here? Basically, we’re adding a new virtual host status.dns.example.net on our main interface of dns.example.net. We’re using a reverse proxy to to send all requests coming from the outside to our internal PowerDNS web server on port 8081. Also, we’re forcing a text/html content type in the proxy request filter, because otherwise we would just get text/plain and we would simply see the source code, which is probably not what you want. Let’s enable the site for a test:

```
    $ a2ensite status.dns.example.net
    $ /etc/init.d/apache2 reload
```

If you point your web browser to status.dns.example.net you should now see the internal status page of PowerDNS. If you set a password above, you will see a password dialogue. This is the password dialogue sent by the PowerDNS web server. The user name is admin and the password is your password. Try it out now, because we’ll get rid of this in a minute.

For security reasons, you probably want to use Apache 2 for authentication. E.g. you might want use a SSL connection and authenticate your co-workers using the internal LDAP server of your company intranet. You might even stay with the insecure basic authentication method, but use other user names. This is entirely up to you and beyond the scope of this post. Consult the Apache 2 documentation on how to do this. What you probably don’t want to do, however, is to authenticate twice (first your secure authentication method and then PowerDNS basic authentication. Luckily, we can configure the Apache 2 proxy to do the authentication for us. This is a bit tricky, though.
To authenticate at the PowerDNS server, Apache 2 needs to send an additional Authorization header line to the PowerDNS server with every request it handles. We use the RequestHeader directive to override any existing Authorization header with our own authentication data. Add the following lines just before the end of the virtual host container.

```
            <Location />
                    RequestHeader Set Authorization "Basic YWRtaW46UG93ZXJETlM="
            </Location>
```

The above example works only for our example password, which is PowerDNS. Try it for a test. This is, because part of the header value is encrypted using the base64 algorithm. You need to change the encrypted part YWRtaW46UG93ZXJETlM=. In plain text the encrypted string would read admin:PowerDNS, where admin is the user name and PowerDNS is the password. To use your own password, you need to encrypt the string admin:yourownpassword using the base64 algorithm and replace our example string. Be sure to keep the Basic and the space. It is crucial for success, that you’ve got the right encrypted string. There are a number of online tools, to encode and decode these strings. To ensure, that you’ve got the correct encryption method, encode the example string and compare it to the string above for a reference. If you’ve got the wrong string, it will not work.

Restart the Apache 2 server. To clear your password cache, restart your browser. Now surf to the site again. You will see, that the password dialogue is gone. Now, don’t forget to secure the page again using Apache 2. Under any circumstances, do not use Directory containers in the configuration. These will not apply to the proxy, because the proxy is not a physical directory on your server. Use Location containers like we did above for setting the RequestHeader directive. Also, you could still use insecure basic authentication to secure the page, if you wanted. It would work regardless of the RequestHeader magic.
A light-weight alternative

For those of you, who think that Apache is too heavy, here is an example for the nginx web server:
```
    $ vi /etc/nginx/sites-available/status.dns.example.net
    server {
       listen 192.168.0.1:80;
       server_name status.dns.example.net;
       root /var/www/nginx-default;
       location / {
          index index.html
          proxy_pass http://localhost:8081;
          proxy_redirect off;
          proxy_set_header Authorization "Basic YWRtaW46UG93ZXJETlM=";
       }
    }
```
