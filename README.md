yapdnsui
========

*Yet Another PowerDNS UI ThatDoesntSuck™ (well, hopefully)*

The ultimate goal is to produce a slick web interface to PowerDNS that
will let you do add/remove/update domains and records in your PowerDNs
instance via API.
You can also see the live configuration and live statistics for demonstration purporse.

![yapdnsui_livestats]
(https://github.com/leucos/pdnsui/raw/master/misc/screenshot_livestats.png)

![yapdnsui_config]
(https://github.com/leucos/pdnsui/raw/master/misc/screenshot_config.png)

![yapdnsui_domains]
(https://github.com/leucos/pdnsui/raw/master/misc/screenshot_domains.png)

![yapdnsui_records]
(https://github.com/leucos/pdnsui/raw/master/misc/screenshot_records.png)

Prereqs
-------

You need NodeJS for this to work.

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
* Enjoy

_Note_ : you don't need to have powerdns on the machine to try this out.
However, you need to specify the password and hostname.

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

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
This is released [GPLv3](http://www.gnu.org/licenses/gpl.html), and comes without any warranty.

Credits
-------

- yaPDNSui is built with the awesome [NodeJS](http://nodejs.org) and [Express](http://expressjs.com).

- Layout & CSS: [http://twitter.github.com/bootstrap/] (http://twitter.github.com/bootstrap/)

- Favicon from: [http://glyphicons.com/] (http://glyphicons.com/)

- Apple touch icon from: [http://findicons.com/search/leaf] (http://findicons.com/search/leaf)
