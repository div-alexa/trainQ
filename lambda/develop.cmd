@echo off
start npx tsc -w
start bst proxy lambda dist/index.js