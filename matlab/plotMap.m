clear;
figure;
hold on;
treshold = .2;

%
fname = strcat('resources/positionMap114.json');
fid = fopen(fname);
raw = fread(fid,inf);
str = char(raw');
fclose(fid);

data = JSON.parse(str);
%


%for i=1:1:100
%    points(i,:) = [rand rand]';
%end
for i=1:1:length(data.links)
    sp = data.links{i}.start;
    ep = data.links{i}.end;
    plot([sp.lng ep.lng],[sp.lat ep.lat],'b-') 
end

for i=1:1:length(data.ac)    
    plot(data.ac{i}.lng,data.ac{i}.lat,'bo')    
end

plot(-8.9168798,52.6996573, 'r.','MarkerSize',25);
plot(-54.5681016,48.9418259, 'r.','MarkerSize',25)