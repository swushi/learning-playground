#!/bin/bash

# Loop over every word in a sentence

sentence='This is a sentence'

for word in $sentence; do
  echo $word
done

# Seperate words by comma

csv='a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p'

sep=$IFS
IFS=,

for letter in $csv; do
  echo $letter
done

IFS=$sep

# Reading a dictionary and iterating over it

words=$(cat words.txt)
idx=0
for word in $words; do
#  echo "$idx - $word"
  idx=$(expr $idx + 1)
done

echo "There are $idx words in the dictionary."
