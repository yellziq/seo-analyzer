"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScorerService = void 0;
const common_1 = require("@nestjs/common");
let ScorerService = class ScorerService {
    score(data) {
        const checks = [
            this.scoreTitle(data),
            this.scoreMetaDescription(data),
            this.scoreH1(data),
            this.scoreHeadings(data),
            this.scoreCanonical(data),
            this.scoreRobotsMeta(data),
            this.scoreOpenGraph(data),
            this.scoreImagesAlt(data),
            this.scoreHttps(data),
            this.scoreUrlLength(data),
            this.scoreHtmlLang(data),
            this.scoreTextContent(data),
        ];
        const penalty = checks.reduce((total, check) => {
            if (check.status === 'Warning') {
                return total + 5;
            }
            if (check.status === 'Failed') {
                return total + 15;
            }
            return total;
        }, 0);
        return {
            score: Math.max(0, 100 - penalty),
            checks,
        };
    }
    scoreTitle(data) {
        const length = data.title.length;
        if (!data.title.text) {
            return {
                tag: 'Title',
                status: 'Failed',
                description: 'Title is missing.',
            };
        }
        if (length > 70) {
            return {
                tag: 'Title',
                status: 'Failed',
                description: `Title length is ${length} characters, which is too long for search results.`,
            };
        }
        if (length >= 10 && length <= 60) {
            return {
                tag: 'Title',
                status: 'Passed',
                description: `Title length is ${length} characters, which is within the recommended range.`,
            };
        }
        if (length >= 61 && length <= 70) {
            return {
                tag: 'Title',
                status: 'Warning',
                description: `Title length is ${length} characters. It may be truncated in search results.`,
            };
        }
        return {
            tag: 'Title',
            status: 'Warning',
            description: `Title length is ${length} characters, which is shorter than the recommended minimum.`,
        };
    }
    scoreMetaDescription(data) {
        const length = data.metaDescription.length;
        if (!data.metaDescription.text) {
            return {
                tag: 'Meta Description',
                status: 'Failed',
                description: 'Meta description is missing.',
            };
        }
        if (length >= 50 && length <= 160) {
            return {
                tag: 'Meta Description',
                status: 'Passed',
                description: `Meta description length is ${length} characters.`,
            };
        }
        if (length < 50) {
            return {
                tag: 'Meta Description',
                status: 'Warning',
                description: `Meta description is too short at ${length} characters. Add more useful summary text.`,
            };
        }
        return {
            tag: 'Meta Description',
            status: 'Warning',
            description: `Meta description is too long at ${length} characters and may be truncated.`,
        };
    }
    scoreH1(data) {
        if (data.h1.count === 1) {
            return {
                tag: 'H1',
                status: 'Passed',
                description: `One H1 is present: "${data.h1.firstValue}".`,
            };
        }
        if (data.h1.count > 1) {
            return {
                tag: 'H1',
                status: 'Warning',
                description: `${data.h1.count} H1 tags were found. Use one primary H1.`,
            };
        }
        return {
            tag: 'H1',
            status: 'Failed',
            description: 'No H1 tag was found.',
        };
    }
    scoreHeadings(data) {
        if (data.headings.count >= 1) {
            return {
                tag: 'H2-H6',
                status: 'Passed',
                description: `${data.headings.count} secondary heading tags were found.`,
            };
        }
        return {
            tag: 'H2-H6',
            status: 'Warning',
            description: 'No H2-H6 heading tags were found.',
        };
    }
    scoreCanonical(data) {
        if (data.canonical.href) {
            return {
                tag: 'Canonical',
                status: 'Passed',
                description: `Canonical URL is set to ${data.canonical.href}.`,
            };
        }
        return {
            tag: 'Canonical',
            status: 'Failed',
            description: 'Canonical tag is missing.',
        };
    }
    scoreRobotsMeta(data) {
        const content = data.robotsMeta.content?.toLowerCase();
        if (!content) {
            return {
                tag: 'Robots Meta',
                status: 'Warning',
                description: 'Robots meta tag is missing.',
            };
        }
        if (content.includes('noindex')) {
            return {
                tag: 'Robots Meta',
                status: 'Failed',
                description: 'Robots meta tag contains noindex.',
            };
        }
        if (content.includes('index')) {
            return {
                tag: 'Robots Meta',
                status: 'Passed',
                description: `Robots meta tag allows indexing: "${data.robotsMeta.content}".`,
            };
        }
        return {
            tag: 'Robots Meta',
            status: 'Warning',
            description: `Robots meta tag exists, but indexing intent is unclear: "${data.robotsMeta.content}".`,
        };
    }
    scoreOpenGraph(data) {
        const values = Object.values(data.openGraph);
        const presentCount = values.filter(Boolean).length;
        if (presentCount === values.length) {
            return {
                tag: 'Open Graph',
                status: 'Passed',
                description: 'og:title, og:description, and og:image are present.',
            };
        }
        if (presentCount > 0) {
            return {
                tag: 'Open Graph',
                status: 'Warning',
                description: `${presentCount} of 3 required Open Graph tags are present.`,
            };
        }
        return {
            tag: 'Open Graph',
            status: 'Failed',
            description: 'No required Open Graph tags were found.',
        };
    }
    scoreImagesAlt(data) {
        const { totalCount, withoutAltCount } = data.images;
        if (totalCount === 0) {
            return {
                tag: 'Images Alt',
                status: 'Passed',
                description: 'No images found, so the image alt check is not applicable.',
            };
        }
        if (withoutAltCount === 0) {
            return {
                tag: 'Images Alt',
                status: 'Passed',
                description: 'All images have alt attributes.',
            };
        }
        if (withoutAltCount > totalCount / 2) {
            return {
                tag: 'Images Alt',
                status: 'Failed',
                description: `${withoutAltCount} of ${totalCount} images are missing alt attributes.`,
            };
        }
        return {
            tag: 'Images Alt',
            status: 'Warning',
            description: `${withoutAltCount} of ${totalCount} images are missing alt attributes.`,
        };
    }
    scoreHttps(data) {
        if (data.isHttps) {
            return {
                tag: 'HTTPS',
                status: 'Passed',
                description: 'The analyzed URL uses HTTPS.',
            };
        }
        return {
            tag: 'HTTPS',
            status: 'Failed',
            description: 'The analyzed URL does not use HTTPS.',
        };
    }
    scoreUrlLength(data) {
        const { value, length } = data.url;
        if (!value) {
            return {
                tag: 'URL Length',
                status: 'Passed',
                description: 'No URL was provided, so the URL length check is not applicable.',
            };
        }
        if (length <= 75) {
            return {
                tag: 'URL Length',
                status: 'Passed',
                description: `URL length is ${length} characters, which is concise for users and search engines.`,
            };
        }
        if (length <= 115) {
            return {
                tag: 'URL Length',
                status: 'Warning',
                description: `URL length is ${length} characters. Shorter URLs are usually easier to read and share.`,
            };
        }
        return {
            tag: 'URL Length',
            status: 'Failed',
            description: `URL length is ${length} characters, which is too long for a clean SEO-friendly URL.`,
        };
    }
    scoreHtmlLang(data) {
        if (data.htmlLang.value) {
            return {
                tag: 'HTML Lang',
                status: 'Passed',
                description: `The html lang attribute is set to "${data.htmlLang.value}".`,
            };
        }
        return {
            tag: 'HTML Lang',
            status: 'Warning',
            description: 'The html lang attribute is missing. Add it to help search engines and assistive technologies understand the page language.',
        };
    }
    scoreTextContent(data) {
        const { length, ratio } = data.textContent;
        const ratioPercent = Math.round(ratio * 100);
        if (length === 0) {
            return {
                tag: 'Text Content',
                status: 'Failed',
                description: 'No visible text content was found on the page.',
            };
        }
        if (length < 300 || ratio < 0.1) {
            return {
                tag: 'Text Content',
                status: 'Warning',
                description: `Visible text length is ${length} characters and text-to-code ratio is ${ratioPercent}%. Add more useful indexable content.`,
            };
        }
        return {
            tag: 'Text Content',
            status: 'Passed',
            description: `Visible text length is ${length} characters with a ${ratioPercent}% text-to-code ratio.`,
        };
    }
};
exports.ScorerService = ScorerService;
exports.ScorerService = ScorerService = __decorate([
    (0, common_1.Injectable)()
], ScorerService);
//# sourceMappingURL=scorer.service.js.map