// Shopify BGN/EUR Currency Converter by RIZN v.7
(function() {
    'use strict';
    
    if (window.BgnEurConverterShopifyInitialized) return;
    window.BgnEurConverterShopifyInitialized = true;
    
    // Constants
    const EUR_FACTOR = 1.95583;
    const TEXT_NODES_TO_CHECK = ['span', 'b', 'p', 'strong', 'div', 'li', 'a', 'option', 'del', 'sup', 'sub'];
    const OTHER_NODES_TO_CHECK = ['div', 'dd', 'td', 'ul', 'span', 'p', 's', 'del', 'sup', 'sub'];
    
    // BGN to EUR and EUR to BGN regex patterns (bidirectional)
    const BGN_PATTERNS = [
        { regex: /((лв\.?|лева|лев|BGN|bgn)\s*([0-9.]+,[0-9]{2}))/, priceIndex: 3, decimalSeparator: ',', thousandSeparator: '.', currency: 'BGN' },
        { regex: /((лв\.?|лева|лев|BGN|bgn)\s*([0-9,]+\.[0-9]{2}))/, priceIndex: 3, decimalSeparator: '.', thousandSeparator: ',', currency: 'BGN' },
        { regex: /((лв\.?|лева|лев|BGN|bgn)\s*([0-9][0-9.]*))/, priceIndex: 3, thousandSeparator: '.', currency: 'BGN' },
        { regex: /((лв\.?|лева|лев|BGN|bgn)\s*([0-9][0-9,]*))/, priceIndex: 3, thousandSeparator: ',', currency: 'BGN' },
        { regex: /(([-|+]?[0-9.]+,[0-9]{2})\s*(лв\.?|лева|лев|BGN|bgn))/, priceIndex: 2, decimalSeparator: ',', thousandSeparator: '.', currency: 'BGN' },
        { regex: /(([-|+]?[0-9,]+\.[0-9]{2})\s*(лв\.?|лева|лев|BGN|bgn))/, priceIndex: 2, decimalSeparator: '.', thousandSeparator: ',', currency: 'BGN' },
        { regex: /(([-|+]?[0-9][0-9.]*)\s*(лв\.?|лева|лев|BGN|bgn))/, priceIndex: 2, thousandSeparator: '.', currency: 'BGN' },
        { regex: /(([-|+]?[0-9][0-9,]*)\s*(лв\.?|лева|лев|BGN|bgn))/, priceIndex: 2, thousandSeparator: ',', currency: 'BGN' }
    ];
    
    const EUR_PATTERNS = [
        { regex: /((€|EUR|Eur|eur|евро)\s*([0-9.]+,[0-9]{2}))/, priceIndex: 3, decimalSeparator: ',', thousandSeparator: '.', currency: 'EUR' },
        { regex: /((€|EUR|Eur|eur|евро)\s*([0-9,]+\.[0-9]{2}))/, priceIndex: 3, decimalSeparator: '.', thousandSeparator: ',', currency: 'EUR' },
        { regex: /((€|EUR|Eur|eur|евро)\s*([0-9][0-9.]*))/, priceIndex: 3, thousandSeparator: '.', currency: 'EUR' },
        { regex: /((€|EUR|Eur|eur|евро)\s*([0-9][0-9,]*))/, priceIndex: 3, thousandSeparator: ',', currency: 'EUR' },
        { regex: /(([-|+]?[0-9.]+,[0-9]{2})\s*(€|EUR|Eur|eur|евро))/, priceIndex: 2, decimalSeparator: ',', thousandSeparator: '.', currency: 'EUR' },
        { regex: /(([-|+]?[0-9,]+\.[0-9]{2})\s*(€|EUR|Eur|eur|евро))/, priceIndex: 2, decimalSeparator: '.', thousandSeparator: ',', currency: 'EUR' },
        { regex: /(([-|+]?[0-9][0-9.]*)\s*(€|EUR|Eur|eur|евро))/, priceIndex: 2, thousandSeparator: '.', currency: 'EUR' },
        { regex: /(([-|+]?[0-9][0-9,]*)\s*(€|EUR|Eur|eur|евро))/, priceIndex: 2, thousandSeparator: ',', currency: 'EUR' }
    ];
    
    const ALL_PATTERNS = [...BGN_PATTERNS, ...EUR_PATTERNS];
    
    // Helper functions
    function escapeRegexDot(s) {
        return s === '.' ? '\\.' : s;
    }
    
    function format(amount, decimalSeparator = ',', thousandSeparator = '.') {
        let formattedAmount = amount;
        if (decimalSeparator === ',') {
            formattedAmount = formattedAmount.replace('.', ',');
        }
        if (thousandSeparator) {
            formattedAmount = formattedAmount.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
        }
        return formattedAmount;
    }
    
    function convertToEur(number) {
        return (number / EUR_FACTOR).toFixed(2);
    }
    
    function convertToBgn(number) {
        return (number * EUR_FACTOR).toFixed(2);
    }
    
    // Main price matching function (bidirectional)
    function matchPrice(text) {
        // Skip already converted text
        if (text.includes('€)') || text.includes('лв)')) {
            return null;
        }

        let bestMatchLength = 0;
        let number;
        let regex;
        let resultText = '';
        let currentText = text;

        do {
            ALL_PATTERNS.forEach(listRegex => {
                const match = currentText.match(listRegex.regex);
                if (match && match[0].length > bestMatchLength) {
                    bestMatchLength = match[0].length;
                    let cleanedString = match[listRegex.priceIndex];
                    
                    if (listRegex.thousandSeparator) {
                        cleanedString = cleanedString.replace(new RegExp(escapeRegexDot(listRegex.thousandSeparator), 'g'), '');
                    }
                    if (listRegex.decimalSeparator && listRegex.decimalSeparator === ',') {
                        cleanedString = cleanedString.replace(new RegExp(escapeRegexDot(listRegex.decimalSeparator), 'g'), '.');
                    }
                    number = parseFloat(cleanedString);
                    regex = listRegex;
                }
            });
            
            if (bestMatchLength !== 0 && !Number.isNaN(number)) {
                let newValue, suffix;
                
                if (regex.currency === 'BGN') {
                    // BGN to EUR conversion
                    newValue = format(
                        convertToEur(number),
                        regex.decimalSeparator,
                        regex.thousandSeparator
                    );
                    suffix = ' €';
                } else {
                    // EUR to BGN conversion
                    newValue = format(
                        convertToBgn(number),
                        regex.decimalSeparator,
                        regex.thousandSeparator
                    );
                    suffix = ' лв';
                }
                
                const updatedText = currentText.replace(regex.regex, (match, p1) => {
                    return p1 + ' (' + newValue + suffix + ')';
                });
                
                const lastChangedCharIndex = updatedText.indexOf(newValue + suffix + ')') + (newValue + suffix + ')').length;
                resultText += updatedText.substring(0, lastChangedCharIndex);
                currentText = updatedText.substring(lastChangedCharIndex);

                regex = null;
                number = null;
                bestMatchLength = 0;
            } else if (bestMatchLength === 0) {
                resultText += currentText;
                currentText = '';
            }
        } while (currentText.length > 0);

        return resultText;
    }
    
    // Replace price in text node
    function replacePrice(node) {
        const result = matchPrice(node.textContent);
        if (result && result !== node.textContent) {
            node.textContent = result;
        }
    }
    
    // Get nodes by tag names
    function getMapOfNodes(nodes) {
        return nodes.flatMap(tagName => Array.from(document.getElementsByTagName(tagName)));
    }
    
    // Main replacement function
    function replacePrices() {
        let processedCount = 0;
        
        // Process text-only nodes (including del, sup, sub tags)
        const textOnlyNodes = getMapOfNodes(TEXT_NODES_TO_CHECK);

        for (const node of textOnlyNodes) {
            if (!node.childNodes || node.childNodes.length === 0) {
                continue;
            }

            for (const textNode of node.childNodes) {
                if (textNode.nodeType !== Node.TEXT_NODE) {
                    continue;
                }
                
                const originalText = textNode.textContent;
                replacePrice(textNode);
                
                if (textNode.textContent !== originalText) {
                    processedCount++;
                }
            }
        }

        // Process other nodes
        const otherNodes = getMapOfNodes(OTHER_NODES_TO_CHECK);

        for (const node of otherNodes) {
            if (node.childNodes && node.childNodes.length === 1 &&
                node.childNodes[0].nodeType === Node.TEXT_NODE) {
                
                const originalText = node.childNodes[0].textContent;
                replacePrice(node.childNodes[0]);
                
                if (node.childNodes[0].textContent !== originalText) {
                    processedCount++;
                }
            }
        }
        
        if (processedCount > 0) {
            console.log(`Shopify BGN/EUR Converter RZ: Processed ${processedCount} price elements`);
        }
        
        return processedCount;
    }
    
    // Simple mutation observer
    let observerTimeout;
    const observerCallback = () => {
        clearTimeout(observerTimeout);
        observerTimeout = setTimeout(() => {
            replacePrices();
        }, 200);
    };
    
    // Initialize
    const init = () => {
        // Initial processing
        setTimeout(() => {
            replacePrices();
            console.log('Shopify BGN/EUR Converter RZ v7 initialized successfully');
        }, 100);
        
        // Set up observer for dynamic content
        if (window.MutationObserver) {
            const observer = new MutationObserver(observerCallback);
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            // Simple API
            window.BgnEurConverterShopify = {
                refresh: replacePrices,
                disconnect: () => {
                    observer.disconnect();
                    window.BgnEurConverterShopifyInitialized = false;
                },
                version: 'Shopify RZ v7.0'
            };
        }
    };
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
    
})();