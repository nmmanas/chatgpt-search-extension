(function() {
    console.log('Content script starting');
    
    function addTextBox() {
        console.log('Attempting to add text box');
        const exploreGPTsElement = document.querySelector('a[href="/gpts"][data-discover="true"]');
        console.log('Explore GPTs element:', exploreGPTsElement);

        if (exploreGPTsElement && !document.getElementById('custom-textbox')) {
            const textBox = document.createElement('input');
            textBox.id = 'custom-textbox';
            textBox.type = 'text';
            textBox.placeholder = 'Search conversations...';
            exploreGPTsElement.parentElement.insertAdjacentElement('afterend', textBox);
            console.log('Text box added successfully');

            // Add event listener for input changes
            textBox.addEventListener('input', filterConversations);
            console.log('Event listener added to text box');

            const style = document.createElement('style');
            style.textContent = `
                #custom-textbox {
                    width: calc(100% - 20px);
                    padding: 8px;
                    margin: 10px;
                    border: 1px solid var(--tw-border-color);
                    border-radius: 4px;
                    font-size: 14px;
                    background-color: #F4F4F4;
                    color: var(--tw-prose-body);
                }
                #custom-textbox::placeholder {
                    color: var(--tw-prose-body);
                    opacity: 0.6;
                }
                .dark #custom-textbox {
                    background-color: var(--tw-prose-pre-bg, #202123);
                    color: var(--tw-prose-body, #ececf1);
                    border-color: var(--tw-border-color, #4b5563);
                }
                .dark #custom-textbox::placeholder {
                    color: var(--tw-prose-body, #9ca3af);
                }
            `;
            document.head.appendChild(style);
        } else if (document.getElementById('custom-textbox')) {
            console.log('Text box already exists');
        } else {
            console.log('Explore GPTs element not found');
        }
    }

    function filterConversations() {
        const searchTerm = document.getElementById('custom-textbox').value.toLowerCase();
        const conversationElements = document.querySelectorAll('a[href^="/c/"]');

        conversationElements.forEach(element => {
            const conversationTitle = element.textContent.toLowerCase();
            if (conversationTitle.includes(searchTerm)) {
                element.style.display = '';
            } else {
                element.style.display = 'none';
            }
        });
    }

    function init() {
        console.log('Initializing content script');
        addTextBox();
        
        // Set up a MutationObserver to watch for changes
        const observer = new MutationObserver((mutations) => {
            console.log('DOM changed, attempting to add text box again');
            addTextBox();
        });

        observer.observe(document.body, { childList: true, subtree: true });
        console.log('MutationObserver set up');
    }

    // Run the init function when the page is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // This will run immediately
    console.log('Content script loaded');
})();