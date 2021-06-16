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

            $('#btnGenerate')
                .html(chrome.i18n.getMessage("btnGenerate"));
            $('#btnCopyResult')
                .attr('title', chrome.i18n.getMessage("btnCopyResult"));

            $('.noItems')
                .html(chrome.i18n.getMessage("noItems"));
        }

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
        
        var lengthDisplay = 25;

        loadLocalizations();
    });
