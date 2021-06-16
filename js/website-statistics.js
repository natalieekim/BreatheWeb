var websites = [];
var this_domain_database_id = 0;
function extractRootDomain(url) {
    var domain;
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    } else {
        domain = url.split('/')[0];
    }
    domain = domain.split(':')[0];
    var domains = domain.split('.');
    var tld = domains[domains.length - 1];
    var root_domain = domains[domains.length - 2];
    domain = root_domain + "." + tld;
    return domain;
}
function addWebsiteTime(seconds) {
    //loadWebsitesDatabase();
    if (seconds > 0) {
        chrome.storage.sync.get('websites', function(obj) {
            websites = obj['websites'];
            if (typeof websites === 'undefined') {
                websites = [];
            }
            //check if exists
            var domain_already_indexed = false;
            for (i = 0; i < websites.length; i++) {
                if (websites[i]['d'] == this_page_domain) {
                    this_domain_database_id = i;
                    domain_already_indexed = true;
                }
            }
            if (domain_already_indexed == true) {
                websites[this_domain_database_id]["t"] = websites[this_domain_database_id]["t"] + seconds;
                last_logged = nowTime();
                var sync_workaround = {
                    "websites": websites
                };
                chrome.storage.sync.set(sync_workaround, function() {
                });
            }
        });
    }
}
function nowTime() {
    return new Date()
        .getTime() / 1000;
}
function logTime() {
    var time_elapsed = Math.floor(nowTime() - last_logged);
    addWebsiteTime(time_elapsed);
}
var last_logged = nowTime();
var this_page_domain = extractRootDomain(window.location.href);
var log_time_interval = (60000 + Math.floor(Math.random() * 30000));
setInterval(function() {
    logTime();
}, log_time_interval);
