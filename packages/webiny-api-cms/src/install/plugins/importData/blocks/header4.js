export default {
    id: "5c2b69bca0b03cbe22aedc7e",
    name: "Header #4",
    type: "block",
    content: {
        data: {
            settings: {
                width: { value: "1000px" },
                margin: {
                    mobile: { top: 15, left: 15, right: 15, bottom: 15 },
                    desktop: { top: 0, left: 0, right: 0, bottom: 0 },
                    advanced: true
                },
                padding: {
                    mobile: { all: 10 },
                    desktop: { all: 0, top: 25, bottom: 25 },
                    advanced: true
                },
                height: { fullHeight: true, value: "100%" },
                verticalAlign: "center",
                horizontalAlignFlex: "center",
                background: {
                    image: {
                        src:
                            "http://localhost:9000/files/background-1462755_1920-min_11b2jqdrh62g.png"
                    }
                }
            }
        },
        elements: [
            {
                data: {
                    settings: {
                        margin: { desktop: { all: 0 }, mobile: { all: 0 } },
                        padding: { desktop: { all: 0 }, mobile: { all: 0 } },
                        width: { value: "650px" }
                    }
                },
                elements: [
                    {
                        data: {
                            width: 100,
                            settings: {
                                animation: { name: "fade-up" },
                                margin: { desktop: { all: 0 }, mobile: { all: 0 } },
                                padding: {
                                    desktop: { all: 20, top: 20, right: 20, bottom: 20, left: 20 },
                                    mobile: { all: 0 }
                                },
                                background: { color: "rgba(255, 255, 255, 0.5)" },
                                border: { width: 1, radius: 5 },
                                shadow: {
                                    color: "var(--webiny-cms-theme-background)",
                                    horizontal: "2",
                                    vertical: "2",
                                    blur: "34",
                                    spread: "0"
                                }
                            }
                        },
                        elements: [
                            {
                                data: {
                                    text: {
                                        object: "value",
                                        document: {
                                            object: "document",
                                            data: {},
                                            nodes: [
                                                {
                                                    object: "block",
                                                    type: "h3",
                                                    data: { align: "center" },
                                                    nodes: [
                                                        {
                                                            object: "text",
                                                            leaves: [
                                                                {
                                                                    object: "leaf",
                                                                    text: "Anatomy or Astrology",
                                                                    marks: [
                                                                        {
                                                                            object: "mark",
                                                                            type: "bold",
                                                                            data: {}
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    },
                                    settings: {
                                        margin: {
                                            mobile: { top: 0, left: 0, right: 0, bottom: 0 },
                                            desktop: { top: 0, left: 0, right: 0, bottom: 0 },
                                            advanced: true
                                        },
                                        padding: {
                                            desktop: {
                                                all: 25,
                                                bottom: 25,
                                                top: 25,
                                                right: 25,
                                                left: 25
                                            },
                                            mobile: {
                                                all: 15,
                                                top: 15,
                                                right: 15,
                                                bottom: 15,
                                                left: 15
                                            },
                                            advanced: false
                                        },
                                        background: { color: "transparent" }
                                    }
                                },
                                elements: [],
                                type: "cms-element-text"
                            },
                            {
                                data: {
                                    text: {
                                        object: "value",
                                        document: {
                                            object: "document",
                                            data: {},
                                            nodes: [
                                                {
                                                    object: "block",
                                                    type: "paragraph",
                                                    data: { align: "center" },
                                                    nodes: [
                                                        {
                                                            object: "text",
                                                            leaves: [
                                                                {
                                                                    object: "leaf",
                                                                    text:
                                                                        "If you are in the market for a computer, there are a number of factors",
                                                                    marks: [
                                                                        {
                                                                            object: "mark",
                                                                            type: "bold",
                                                                            data: {}
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    },
                                    settings: {
                                        margin: {
                                            mobile: { top: 0, left: 0, right: 0, bottom: 15 },
                                            desktop: { top: 0, left: 0, right: 0, bottom: 25 },
                                            advanced: true
                                        },
                                        padding: {
                                            desktop: {
                                                all: 25,
                                                bottom: 25,
                                                top: 25,
                                                right: 25,
                                                left: 25
                                            },
                                            mobile: {
                                                all: 15,
                                                top: 15,
                                                right: 15,
                                                bottom: 15,
                                                left: 15
                                            },
                                            advanced: false
                                        },
                                        background: { color: "transparent" }
                                    }
                                },
                                elements: [],
                                type: "cms-element-text"
                            },
                            {
                                data: {
                                    text: {
                                        object: "value",
                                        document: {
                                            object: "document",
                                            nodes: [
                                                {
                                                    object: "block",
                                                    type: "button",
                                                    nodes: [
                                                        {
                                                            object: "text",
                                                            leaves: [
                                                                { object: "leaf", text: "Click me" }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    },
                                    type: "primary",
                                    settings: {
                                        margin: { desktop: { all: 0 }, mobile: { all: 0 } },
                                        padding: { desktop: { all: 0 }, mobile: { all: 0 } },
                                        horizontalAlignFlex: "center"
                                    }
                                },
                                elements: [],
                                type: "cms-element-button"
                            }
                        ],
                        type: "cms-element-column"
                    }
                ],
                type: "cms-element-row"
            }
        ],
        type: "cms-element-block"
    },
    preview: {
        name: "cms-element-5c2b69bca0b03cbe22aedc7e_11k1jqds9fba.png",
        size: 980072,
        src: "http://localhost:9000/files/cms-element-5c2b69bca0b03cbe22aedc7e_11k1jqds9fba.png",
        type: "image/png",
        width: 1000,
        height: 597
    },
    category: "cms-block-category-header"
};
