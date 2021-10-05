FROM node:14.17 as builder

RUN useradd -ms /bin/bash appuser
COPY ./planer-uwr-webapp /home/appuser/planer-uwr-webapp
RUN chown -R appuser /home/appuser/planer-uwr-webapp
USER appuser
WORKDIR /home/appuser

RUN mkdir ~/.npm-global && npm config set prefix '~/.npm-global' && export PATH=~/.npm-global/bin:$PATH
RUN npm install -g meteor
WORKDIR /home/appuser/planer-uwr-webapp
RUN npm install --production
RUN /home/appuser/.meteor/meteor build /home/appuser/build
WORKDIR /home/appuser/build
RUN tar -xzf planer-uwr-webapp.tar.gz


FROM node:14.17

COPY --from=builder /home/appuser/build/bundle /bundle
WORKDIR /bundle/programs/server
RUN npm install
ENTRYPOINT [ "/usr/local/bin/node", "/bundle/main.js" ]
