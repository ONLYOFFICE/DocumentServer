#!/bin/bash

BRANCHES=()

BRANCHES+=(develop)
BRANCHES+=(master)

if [ -n "$1" ]; then
    BRANCHES+=($1)
fi

for i in ${BRANCHES[@]}; do
  mr git checkout ${i}
  mr git pull
done
