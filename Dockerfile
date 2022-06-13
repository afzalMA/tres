FROM node:16-alpine3.11 as build-step
MAINTAINER adityasai125@gmail.com

RUN mkdir /app

WORKDIR /app

COPY package.json /app


ADD public  /app/
ADD src  /app/
ADD .prettierignore /app/
ADD .prettierrc.js /app/
ADD aliases.config.js /app/
ADD jsconfig.json /app/
ADD jsconfig.template.js /app/
ADD next.config.js /app/
ADD postcss.config.js /app/
ADD server.js /app/
ADD tailwind.config.js /app/
RUN npm install
ADD setup.sh /setup.sh
RUN chmod +x /setup.sh
ENTRYPOINT ["sh","/setup.sh"]