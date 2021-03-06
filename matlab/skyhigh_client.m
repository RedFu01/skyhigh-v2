clear all;
%config
baseUrl = 'http://localhost:3000/raw/flights'; %for use at comNets: http://orion6:3000/raw/flights
statusUrl = strcat(baseUrl, '/status');
chunkUrl = strcat(baseUrl, '/chunk');
progress = 0;
index = 0;

%query config set to -1 to disable
minLat              = 10;               % in degree 
maxLat              = 65;               % in degree
minLng              = -75;              % in degree
maxLng              = -8;               % in degree
minDuration         = 7200;             % in seconds
overallMinHeading   = 0;                % in degree
overallMaxHeading   = 100;              % in degree
startTime           = 1401580800;       % Unix timestamp
endTime             = 1401667200;       % Unix timestamp
minAltitude         = 0         ;       % in meters
maxAltitude         = 100;              % in meters
deltaT              = 1000;             % time interval for interpolation in seconds (defaults to 10)


%initial request - starts server calculation and stores query-uuid
query = struct('endTime', endTime, 'startTime', startTime, 'minLat', minLat, 'maxLat', maxLat, 'minLng', minLng, 'maxLng', maxLng, 'minDuration', minDuration, 'overallMinHeading', overallMinHeading, 'overallMaxHeading', overallMaxHeading, 'minAltitude', minAltitude, 'maxAltitude', maxAltitude);
data = struct('api_key', 'A');
postOptions = weboptions('MediaType', 'application/json', 'Timeout', 3600000);
getOptions = weboptions('Timeout', 3600000);
response = webwrite(baseUrl, query, postOptions);

uuid = response.uuid;
uuid = '600km_3b59def3-d9b4-4dc1-a05a-f08281a944ce'
%periodically ask the server for the status of the executed query
while(progress < 1)
    data = struct('uuid', uuid);
    response = webwrite(statusUrl, data, postOptions);
    progress = response.progress;
    pause(2);
    disp('Loading ...')
    pause(.1);
end

%load the data once the query is executed in chunks
disp('')
disp('Started Loading')
disp('')
cres = webread(chunkUrl, 'uuid', uuid, 'start', index, getOptions);
flightData = cres;

while ~isempty(cres)
    index = index + 200;
    cres = webread(chunkUrl, 'deltat', deltaT, 'uuid', uuid, 'start', index, getOptions);
    flightData = cat(1, flightData,cres);
    msg = strcat('Loaded:',{' '},num2str(length(flightData)));
    disp(msg{1});
end

%ready to go!
