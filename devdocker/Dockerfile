# syntax=docker/dockerfile:1
# docker build -t devdocker devdocker

FROM ubuntu
WORKDIR /app
COPY . .
RUN ["cp","/app/zsh_profile", "/root/.zshrc"]
RUN ["cp","/app/bash_profile", "/root/.bashrc"]
EXPOSE 4000
EXPOSE 35729
RUN apt-get update
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get -y install tzdata
RUN apt-get install -y zsh tmux w3m netcat curl wget git
WORKDIR /root
RUN git clone https://github.com/idvorkin/settings ~/settings
RUN git clone https://github.com/idvorkin/idvorkin.github.io ~/blog
# RUN /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
RUN ["cp","/app/zsh_profile", "/root/.zshrc"]

RUN apt-get -y install python3-pip
RUN pip3 install bs4 icecream
RUN apt-get install -y npm fzf vim git make gcc ruby-full bat python3
RUN npm install -g prettier

WORKDIR /root/blog
RUN gem install bundler
RUN bundle install
RUN npm install
CMD ["/usr/bin/tmux"]
