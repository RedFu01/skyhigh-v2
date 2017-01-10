close all;
clear;
conRadius = '100';
fname = strcat('resources/test_headings.json');
fid = fopen(fname);
raw = fread(fid,inf);
str = char(raw');
fclose(fid);

data = JSON.parse(str);

for i=1:1:length(data)
   v(i) = cell2mat(data{i});
end
hist(v)