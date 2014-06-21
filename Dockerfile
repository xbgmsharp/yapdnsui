# NodeJS + SSHD + myapp
#
# Base from ultimate-seed Dockerfile
# https://github.com/pilwon/ultimate-seed
#
# Mainly to run yapdnsui
# https://github.com/xbgmsharp/yapdnsui
#
# DOCKER-VERSION 0.9.1
# VERSION 0.0.1

# Pull base image.
FROM dockerfile/nodejs
MAINTAINER Francois Lacroix <xbgmsharp@gmail.com>

# Setup system and install tools
RUN echo "initscripts hold" | dpkg --set-selections
RUN echo 'alias ll="ls -lah --color=auto"' >> /etc/bash.bashrc

# Set locale
RUN apt-get -qqy install locales
RUN locale-gen --purge en_US en_US.UTF-8
RUN dpkg-reconfigure locales
ENV LC_ALL en_US.UTF-8

# Set ENV
ENV HOME /root
ENV DEBIAN_FRONTEND noninteractive

# Make sure the package repository is up to date
RUN apt-get update && apt-get -y upgrade

# Install nodejs dependencies
RUN npm install -g bower grunt-cli
# Install my application dependencies
RUN npm install -g express express-generator jade moment request

# Install my dependencies
RUN apt-get -y install nano curl wget vim
# Install Git
RUN apt-get -y install git

# Install SSH
RUN apt-get install -y openssh-server
RUN sed -ri 's/UsePAM yes/#UsePAM yes/g' /etc/ssh/sshd_config
RUN sed -ri 's/#UsePAM no/UsePAM no/g' /etc/ssh/sshd_config
RUN sed 's/#PermitRootLogin yes/PermitRootLogin yes/' -i /etc/ssh/sshd_config
RUN sed 's/PermitRootLogin without-password/PermitRootLogin yes/' -i /etc/ssh/sshd_config
RUN mkdir /var/run/sshd
RUN echo 'root:admin' | chpasswd

# Add app directory.
ADD startup.sh /app/startup.sh
#ADD . /app

# Install `mybank` from git
RUN cd /app && \
  git clone https://github.com/xbgmsharp/yapdnsui

RUN \
  cd /app/yapdnsui && \
  npm prune --production && \
  npm install --production --unsafe-perm && \
  npm rebuild

# Define environment variables
#ENV NODE_ENV production
ENV PORT 3000

# Define working directory.
WORKDIR /appy/apdnsui

# Define default command.
CMD ["DEBUG=yapdnsui node", "/app/yapdnsui/bin/www"]
# Start ssh services.
CMD ["/bin/bash", "/app/startup.sh"]

# Expose ports.
EXPOSE 22 3000

# Clean up APT when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Make sure the package repository is up to date
ONBUILD apt-get update && apt-get -y upgrade
ONBUILD apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
