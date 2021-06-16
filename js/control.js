$('document')
    .ready(function() {
        // Generate milliseconds when user presses on button and then releases
        function milliseconds() {
            var start,
            end,
            delta,
            button = document.getElementById("btnGenerate"); 

            button.addEventListener("mousedown", function() {
                start = new Date(); 
            }); 

            button.addEventListener("mouseup", function() {
                end = new Date();
                delta = end - start;
            });
            return delta; 
        }


        // Generate new password
        function generate() {

            var length;
            var keys = '';
            var result = '';

            keys += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; 

            var time = milliseconds(); 
            keys += time; 

            for (var i = 1; i <= 8; i++) {
                var keyPos = Math.round(Math.random() * (keys.length - 1));
                result += keys.charAt(keyPos);
            }

            $('#result')
                .html(result.length > lengthDisplay ? result.substr(0, lengthDisplay - 3) + '...' : result);
            $('#result')
                .attr('title', result);
            $('#resultContainer')
                .html(result);

            historyItems[historyItemCount] = result;

            if ($('#optionsRememberPasswords')
                .is(':checked') == true) {
                storeSetting('passwordHistory', JSON.stringify(historyItems));
            }

            addToList(result);
        }

        // Adds generated password to history tab
        function addToList(pass) {

            var itemCount = ++historyItemCount;
            var itemString = '<label class="historyItem"><input type="checkbox" /><span title="' + pass.replace(g, '&quot;') + '">' + (pass.length > lengthDisplay ? pass.substr(0, lengthDisplay - 3) + '...' : pass) + '</span></label>';

            if (itemCount == 1) {
                $('#historyListWrapper')
                    .html(itemString);
                $('#historySelectionWrapper')
                    .show();
            } else {
                $('#historyListWrapper')
                    .prepend(itemString);
            }

            checkButtonStates();

        }



        // Copy given text to clipboard
        function copyToClipboard(text) {
            $('#copyField')
                .val(text);
            $('#copyField')
                .select();
            document.execCommand('Copy');
            $('#copyField')
                .blur();
        }

        // Loads localization strings
        function loadLocalizations() {
            $('#appClose')
                .attr('title', chrome.i18n.getMessage("appClose"))

            $('#tabGenerator')
                .html(chrome.i18n.getMessage("tabGenerator"));
            $('#tabHistory')
                .html(chrome.i18n.getMessage("tabHistory"));
            $('#tabOptions')
                .attr('title', chrome.i18n.getMessage("tabOptions"));

            $('#btnGenerate')
                .html(chrome.i18n.getMessage("btnGenerate"));
            $('#btnCopyResult')
                .attr('title', chrome.i18n.getMessage("btnCopyResult"));
            $('#btnCopySelected')
                .html(chrome.i18n.getMessage("btnCopySelected"));
            $('#btnCopyAll')
                .html(chrome.i18n.getMessage("btnCopyAll"));

            $('#historySelectLabel')
                .html(chrome.i18n.getMessage("historySelectLabel"));

            $('#historyClearList')
                .html(chrome.i18n.getMessage("historyClearList"));
            $('#historyClearConfirmMessage')
                .html(chrome.i18n.getMessage("historyClearListConfirm"));
            $('#btnClearYes')
                .html(chrome.i18n.getMessage("historyClearListConfirmYes"));
            $('#btnClearNo')
                .html(chrome.i18n.getMessage("historyClearListConfirmNo"));

            $('.noItems')
                .html(chrome.i18n.getMessage("noItems"));
        }

        // Loads complete settings from localStorage or sets default value
        function loadSettings() {

            if (localStorage['passwordHistory'] != undefined) {
                historyItems = JSON.parse(localStorage['passwordHistory']);

                if (historyItems.length > 0) {
                    for (i = 0; i < historyItems.length; i++) {
                        addToList(historyItems[i]);
                    }
                }

            }

            checkButtonStates();
        }

        // Store settings to localStorage
        function storeSetting(name, value) {
            localStorage[name] = value;
        }

        // Event handlers

        // X to close window
        $('#appClose')
            .click(function() {
                window.close();
            });

        // Tab switching
        $('#appTabs .tab')
            .click(function() {
                $('#appTabs .tab.selected')
                    .removeClass('selected');
                $(this)
                    .addClass('selected');

                var contentId = 'content' + $(this)
                    .attr('id')
                    .substr(3);

                $('#appContents .content.selected')
                    .removeClass('selected');
                $('#appContents #' + contentId)
                    .addClass('selected');
            });

        // Button Generate
        $('#btnGenerate')
            .click(function() {
                if (!$(this)
                    .hasClass('disabled'))
                    generate();
                return false;
            });

        // Button CopyResult
        $('#btnCopyResult')
            .click(function() {
                if (!$(this)
                    .hasClass('disabled')) {
                    copyToClipboard($('#resultContainer')
                        .html());
                }
                return false;
            });

        // Button CopySelected
        $('#btnCopySelected')
            .click(function() {
                if (!$(this)
                    .hasClass('disabled')) {
                    var copyContent = '';

                    $('#historyListWrapper .historyItem')
                        .each(function() {
                            if ($(this)
                                .find('input[type="checkbox"]')
                                .is(':checked') == true)
                                copyContent += $(this)
                                .find('span')
                                .attr('title') + "\n";
                        });

                    copyToClipboard(copyContent);
                }
                return false;
            });

        // Button CopyAll
        $('#btnCopyAll')
            .click(function() {
                if (!$(this)
                    .hasClass('disabled')) {
                    var copyContent = '';

                    $('#historyListWrapper .historyItem span')
                        .each(function() {
                            copyContent += $(this)
                                .attr('title') + "\n";
                        });

                    copyToClipboard(copyContent);
                }
                return false;
            });

        // Clear history confirm
        $('#historyClearList')
            .click(function() {
                $('#historyClearConfirmWrapper')
                    .fadeIn('fast');
            });

        // Clear history confirm yes
        $('#btnClearYes')
            .click(function() {
                historyItems = new Array;
                historyItemCount = 0;
                localStorage.removeItem('passwordHistory');
                $('#historyListWrapper')
                    .html('<div class="noItems"></div>');
                $('.noItems')
                    .html(chrome.i18n.getMessage("noItems"));
                $('#historySelectionWrapper')
                    .hide();
                $('#historyClearConfirmWrapper')
                    .hide();
                checkButtonStates();
            });

        // Clear history confirm no
        $('#btnClearNo')
            .click(function() {
                $('#historyClearConfirmWrapper')
                    .fadeOut('fast');
            });

        // History list items event delegation
        $('#historyListWrapper .historyItem input[type="checkbox"]')
            .live('click', function() {
                checkButtonStates();
            });

        
        //
        // Extension settings initialization
        //
        

        var defaultSettings = new Array;
        var historyItems = new Array;
        var historyItemCount = 0;

        initDefaultSettings();
        loadSettings();
        loadLocalizations();
    });
