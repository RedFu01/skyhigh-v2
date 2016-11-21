%clear;
%figure;
%hold on;

%
%fname = strcat('resources/linkDetails_001.json');
%fid = fopen(fname);
%raw = fread(fid,inf);
%str = char(raw');
%fclose(fid);

%data = JSON.parse(str);

for i=1:1:length(data)
    if(~isempty(data{i}.start))
        data{i}.start{1}
    end
end