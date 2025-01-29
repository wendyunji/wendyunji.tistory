import { writeFileSync } from 'node:fs';
import Parser from "rss-parser";

let text = `# Hi there 👋

## 이런 환경에 익숙해요✍🏼

## 언어

## 📕 Latest Blog Posts

`;

const parser = new Parser({
    headers: {
        Accept: 'application/rss+xml, application/xml, text/xml; q=0.1',
    }
});

(async () => {
    try {
        const feed = await parser.parseURL('https://wendyunji.tistory.com/rss');

        if (!feed.items || feed.items.length === 0) {
            console.error("❌ feed.items가 비어 있습니다. 블로그 RSS URL이 올바른지 확인하세요.");
            return;
        }

        text += `<ul>`;

        // 🔥 feed.items.length까지만 루프 실행
        for (let i = 0; i < Math.min(10, feed.items.length); i++) {
            if (!feed.items[i]) {
                console.error(`⚠️ feed.items[${i}]가 존재하지 않습니다.`);
                continue;
            }

            const { title, link } = feed.items[i];
            console.log(`✅ ${i + 1}번째 게시물 추가: ${title}`);
            text += `<li><a href='${link}' target='_blank'>${title}</a></li>`;
        }

        text += `</ul>`;

        writeFileSync('README.md', text, 'utf8');
        console.log('✅ 업데이트 완료');
    } catch (error) {
        console.error("❌ RSS 데이터를 불러오는 중 오류 발생:", error);
    }
})();
