#!/bin/bash

cd /app

nohup npm run dev
tailf nohup.out

