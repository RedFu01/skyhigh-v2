close all;
clear;
conRadius = '100';
fname = strcat('resources/raw_avg_headings.json');
fid = fopen(fname);
raw = fread(fid,inf);
str = char(raw');
fclose(fid);

data = JSON.parse(str);