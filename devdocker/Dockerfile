# syntax=docker/dockerfile:1
# docker build -t devdocker devdocker
FROM amazonlinux
WORKDIR /app
COPY . .
RUN yum install -y zsh tmux npm npmx fzf vim git make gcc
RUN amazon-linux-extras install -y ruby2.6
RUN yum install -y ruby-devel
RUN echo "set -o vi" > "/root/.zshrc"
WORKDIR /root
RUN git clone https://github.com/idvorkin/settings ~/settings
RUN git clone https://github.com/idvorkin/idvorkin.github.io ~/blog
# RUN /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
WORKDIR /root/blog
RUN "gem install bundler"
CMD ["/bin/bash"]
