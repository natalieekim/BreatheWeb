function loadWebsitesDatabase() {
    chrome.storage.sync.get('websites', function(obj) {
        var websites = obj['websites'];
        if (typeof websites === 'undefined') {
            websites = [];
        }
        var website_list = $(".website-list");
        var current_page_indexed = false;
        for (i = 0; i < websites.length; i++) {
            if (websites[i]['d'] == this_page_domain) {
                current_page_indexed = true;
            }
            var site = $('<div></div>');
            var site_title = $('<div></div>');
            var site_time = $('<div></div>');
            var site_icon = $('<img>');
            var del_site = $('<div><img src="http://toastur.com/assets/icons/white/close.svg"/></div>');
            site.addClass('site');
            //http://www.google.com/s2/favicons?domain=evernote.com
            site_title.addClass('title');
            site_time.addClass('time');
            site_icon.addClass('favicon');
            del_site.addClass('delete-icon');
            site_icon.attr('src', 'http://www.google.com/s2/favicons?domain=' + websites[i]['d']);
            site.data('website-domain', websites[i]['d']);
            site.attr('data-website-domain', websites[i]['d']);
            site_title.html(websites[i]['d']);
            time_spent = Math.floor((websites[i]['t'] * 10) / 3600) / 10;
            site_time.html(time_spent + " hours");
            site.append(site_icon);
            site.append(site_title);
            site.append(site_time);
            site.append(del_site);
            website_list.append(site);
        }
        if (websites.length == 0) {
            var how_to_add = $('<div></div>');
            how_to_add.addClass('add-tut');
            how_to_add.html("Go to the website you wish to add to the tracking list, then click the above button.<br><br>Because of restrictions Google has placed on Chrome Extensions, <strong>only 120 websites can be tracked at once.</strong>");
            website_list.append(how_to_add);
        } else {
            var website_added_count = $('<div></div>');
            website_added_count.addClass('tracked-website-count');
            website_added_count.html(websites.length + ' of 120 websites tracked<br><br>If you like this extension, consider donating bitcoin to <br><strong>1CFSfPqcjEHhvheFDzPEvZS5mtese2chqE<strong>');
            if (website_added_count > 100) {
                website_added_count.attr('data-approaching-limit', 'true');
            }
            website_list.append(website_added_count);
        }
        if (current_page_indexed == false) {
            $('#add-current-site')
                .html('<a class="reg-button">Track ' + this_page_domain + '</a>');
        }
    });
}
function addCurrentSiteToWatchlist() {
    chrome.storage.sync.get('websites', function(obj) {
        var websites = obj['websites'];
        if (typeof websites === 'undefined') {
            websites = [];
        }
        var index_new_site = true;
        var response_msg = "Error";
        for (i = 0; i < websites.length; i++) {
            if (websites[i]['d'] == this_page_domain) {
                index_new_site = false;
                response_msg = "This website is already added.";
            }
        }
        if (websites.length >= 120) {
            // Chrome doesn't allow more than 8kb of data in the sync container. 6kb is roughly 120 tracked websites, but I'm playing it safe.
            index_new_site = false;
        } else {
            response_msg = "Can't track more than 120 sites.";
        }
        if (index_new_site == true) {
            websites.push({
                "d": this_page_domain,
                "t": 0
            });
            response_msg = "Added " + this_page_domain;
        }
        var sync_workaround = {
            "websites": websites
        };
        chrome.storage.sync.set(sync_workaround, function() {
            // Set done
        });
        $("#add-current-site")
            .html('<div class="add-response">' + response_msg + '</div>');
    });
}
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
function stopTrackingSite(domain_to_del) {
    chrome.storage.sync.get('websites', function(obj) {
        var websites = obj['websites'];
        if (typeof websites === 'undefined') {
            websites = [];
        }
        for (i = 0; i < websites.length; i++) {
            if (websites[i]['d'] == domain_to_del) {
                websites.splice(i, 1);
            }
        }
        var sync_workaround = {
            "websites": websites
        };
        chrome.storage.sync.set(sync_workaround, function() {
            // Set done
        });
        $('.website-list .site[data-website-domain="' + domain_to_del + '"]')
            .slideUp(400);
    });
}
var this_page_domain;
chrome.tabs.query({
        'active': true,
        'windowId': chrome.windows.WINDOW_ID_CURRENT
    },
    function(tabs) {
        this_page_domain = extractRootDomain(tabs[0].url);
        loadWebsitesDatabase();
    }
);
$(document)
    .on('click', '#add-current-site .reg-button', function() {
        addCurrentSiteToWatchlist();
    });
$(document)
    .on('click', '.website-list .site .delete-icon', function() {
        var domain = $(this)
            .closest('.site')
            .data('website-domain');
        stopTrackingSite(domain);
    });
