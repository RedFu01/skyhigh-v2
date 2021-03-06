close all;
clear;
conRadius = '150';
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
histogram(duration,0:100:8000)
title(strcat('Path duration | ',conRadius));
xlabel('Path duration [s]')
ylabel('Occurrence')
savefig(strcat('figures/pathDuration', conRadius));

figure;
histogram(duration_high,0:100:8000)
title(strcat('Path duration for pathes > ',num2str(mean(hops)), ' hops | ', conRadius ));
xlabel('Path duration [s]')
ylabel('Occurrence')
savefig(strcat('figures/pathDuration_high', conRadius));

figure;
histogram(duration_low,0:100:8000)
title(strcat('Path duration for pathes < ',num2str(mean(hops)), ' hops | ', conRadius ));
xlabel('Path duration [s]')
ylabel('Occurrence')
savefig(strcat('figures/pathDuration_low',conRadius));

figure;
histogram(hops)
title(strcat('Hops | ', conRadius ));
xlabel('# Hops')
ylabel('Occurrence')
savefig(strcat('figures/hops',conRadius));
%figure;
%hist(occ,50);
%title(fname)
%xlabel('Contact Duration [s]')
%ylabel('Occurrence')

%save(strrep(fname,'.json','.mat'),'occ','fname');
%savefig(strrep(fname,'.json','.fig'));
