clear;
conRadius = '50';
fname = strcat('resources/pathes_',conRadius,'nmi.json');
fid = fopen(fname);
raw = fread(fid,inf);
str = char(raw');
fclose(fid);


data = JSON.parse(str);
for i=1:1:length(data)
   hops(i) = data{i}.hops;
   duration(i) = data{i}.duration;
    
end

for i=1:1:length(data)
    if data{i}.hops> mean(hops)
    duration_high(i) = data{i}.duration;
    else
    duration_low(i) = data{i}.duration;    
    end
    
end

duration_high(duration_high==0) = [];
duration_low(duration_low==0) = [];

figure;
hist(duration,100)
title(strcat('Path duration | ',conRadius));
xlabel('Path duration [s]')
ylabel('Occurrence')
savefig(strcat('pathDuration', conRadius));

figure;
hist(duration_high,100)
title(strcat('Path duration for pathes > ',num2str(mean(hops)), ' hops | ', conRadius ));
xlabel('Path duration [s]')
ylabel('Occurrence')
savefig(strcat('pathDuration_high', conRadius));

figure;
hist(duration_low,100)
title(strcat('Path duration for pathes < ',num2str(mean(hops)), ' hops | ', conRadius ));
xlabel('Path duration [s]')
ylabel('Occurrence')
savefig(strcat('pathDuration_low',conRadius));
%figure;
%hist(occ,50);
%title(fname)
%xlabel('Contact Duration [s]')
%ylabel('Occurrence')

%save(strrep(fname,'.json','.mat'),'occ','fname');
%savefig(strrep(fname,'.json','.fig'));
