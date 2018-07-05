%close all;
%clear;
conRadius = '600';
%fname = strcat('resources/links_',conRadius,'nmi.json');
%fid = fopen(fname);
%raw = fread(fid,inf);
%str = char(raw');
%fclose(fid);

%data = JSON.parse(str);
for i=1:1:length(data)
   duration(i) = data(i).duration;
    
end

figure;
histogram(duration,100)
title(strcat('Link duration Scenario 14 | ',{' '},conRadius,{' '},'km'));
xlabel('Link duration [s]')
ylabel('Occurrence')
savefig(strcat('figures/linkDuration_mock_scenario14'));

