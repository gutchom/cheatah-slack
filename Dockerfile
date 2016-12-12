FROM node:6.9.1

RUN useradd --user-group --create-home --shell /bin/false app

ENV HOME=/home/app

COPY . $HOME/cheatah-slack
RUN chown -R app:app $HOME/

USER app
WORKDIR $HOME/cheatah-slack

ENV PATH=$HOME/cheatah-slack/node_modules/.bin:$PATH

RUN npm install
