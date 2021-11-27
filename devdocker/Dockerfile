# syntax=docker/dockerfile:1
# docker build -t devdocker devdocker
FROM ubuntu
WORKDIR /app
COPY . .
RUN apt-get update
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get -y install tzdata
RUN apt-get install -y zsh tmux npm fzf vim git make gcc ruby-full bat python3
RUN echo "set -o vi" > /root/.zshrc
RUN echo "alias python=/user/bin/python3.10" > /root/.zshrc
RUN echo "set -o vi" > /root/.bashrc
RUN echo "alias python=/user/bin/python3.10" > /root/.bashrc
WORKDIR /root
RUN git clone https://github.com/idvorkin/settings ~/settings
RUN git clone https://github.com/idvorkin/idvorkin.github.io ~/blog
# RUN /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

RUN apt-get -y install python3-pip
RUN pip3 install bs4 icecream
RUN npm install -g prettier


WORKDIR /root/blog
RUN gem install bundler
RUN bundle install
RUN npm install
CMD ["/bin/zsh"]
