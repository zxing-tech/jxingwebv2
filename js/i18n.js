// Client-side i18n translation system for JXING Tech
const i18n = {
    // Translation dictionary
    dict: {
        en: {
            "nav_company": "Company",
            "nav_services": "Services",
            "nav_pricing": "Pricing Plans",
            "nav_cases": "Case Studies",
            "nav_news": "News",
            "nav_contact": "Contact",
            "nav_get_in_touch": "Get In Touch",
            
            "footer_desc": "Full-stack strategic technology partner unifying software engineering, AI automation, and performance marketing.",
            "footer_caps": "Capabilities",
            "footer_comp": "Company",
            "footer_contact": "Contact",
            
            "brand_authority_tag": "Strategic Digital Systems Partner",
            "audit_btn": "Start Technical Audit",
            "capabilities_btn": "Explore Capabilities"
        },
        ms: {
            "nav_company": "Syarikat",
            "nav_services": "Perkhidmatan",
            "nav_pricing": "Pelan Harga",
            "nav_cases": "Kajian Kes",
            "nav_news": "Berita",
            "nav_contact": "Hubungi",
            "nav_get_in_touch": "Hubungi Kami",
            
            "footer_desc": "Rakan kongsi teknologi strategik tindanan penuh menyatukan kejuruteraan perisian, automasi AI dan pemasaran prestasi.",
            "footer_caps": "Keupayaan",
            "footer_comp": "Syarikat",
            "footer_contact": "Hubungi",
            
            "brand_authority_tag": "Rakan Kongsi Sistem Digital Strategik",
            "audit_btn": "Mulakan Audit Teknikal",
            "capabilities_btn": "Terokai Keupayaan"
        },
        zh: {
            "nav_company": "公司介绍",
            "nav_services": "服务项目",
            "nav_pricing": "价格方案",
            "nav_cases": "案例研究",
            "nav_news": "最新动态",
            "nav_contact": "联系我们",
            "nav_get_in_touch": "立即联系",
            
            "footer_desc": "全栈战略技术合作伙伴，融合软件工程、AI工作流自动化和效果营销于一体。",
            "footer_caps": "核心能力",
            "footer_comp": "公司信息",
            "footer_contact": "联系渠道",
            
            "brand_authority_tag": "战略数字化系统合作伙伴",
            "audit_btn": "开启技术评估",
            "capabilities_btn": "了解服务能力"
        }
    },
    
    // Set language and update DOM
    setLanguage(lang) {
        localStorage.setItem("jxing_lang", lang);
        document.documentElement.lang = lang;
        
        // Update language button display (e.g. flag + code)
        const currentLangCodeEl = document.getElementById("current-lang-code");
        const currentLangFlagEl = document.getElementById("current-lang-flag");
        if (currentLangCodeEl) currentLangCodeEl.textContent = lang.toUpperCase();
        if (currentLangFlagEl) {
            const flags = { en: "🇺🇸", ms: "🇲🇾", zh: "🇨🇳" };
            currentLangFlagEl.textContent = flags[lang] || "🇺🇸";
        }
        
        // Translate all elements with data-i18n attribute
        const elements = document.querySelectorAll("[data-i18n]");
        elements.forEach(el => {
            const key = el.getAttribute("data-i18n");
            if (this.dict[lang] && this.dict[lang][key]) {
                // If it is an input placeholder
                if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
                    el.placeholder = this.dict[lang][key];
                } else {
                    el.textContent = this.dict[lang][key];
                }
            }
        });
        
        // Hide dropdown
        const dropdown = document.getElementById("lang-dropdown");
        if (dropdown) dropdown.classList.add("hidden");
    },
    
    // Initialize language
    init() {
        // Toggle dropdown visibility
        const langBtn = document.getElementById("lang-btn");
        const dropdown = document.getElementById("lang-dropdown");
        
        if (langBtn && dropdown) {
            langBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                dropdown.classList.toggle("hidden");
            });
            
            document.addEventListener("click", () => {
                dropdown.classList.add("hidden");
            });
        }
        
        const savedLang = localStorage.getItem("jxing_lang") || "en";
        this.setLanguage(savedLang);
    }
};

// Auto initialize on load
document.addEventListener("DOMContentLoaded", () => {
    i18n.init();
});

// Expose globally for inline onclick handlers
window.setLanguage = (lang) => i18n.setLanguage(lang);
