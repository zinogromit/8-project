# 이미지 제작 기록

기본 제공 이미지 9개는 내장 이미지 생성 도구로 제작한 **가상 제품 콘셉트 사진**이다. 실제 판매 메뉴 사진이 아니다. 원본 PNG와 웹 표시용 JPEG는 모두 `assets/`에 있다.

공통 프롬프트: “Use case: product-mockup. Asset type: square menu card photograph for a fictional Korean cafe presentation website. Single menu item only, centered on warm off-white stone tabletop, pale sage and ivory backdrop, bright natural window light, subtle carrot-orange accent, premium modern minimalist editorial food photography, realistic appetizing texture, cohesive camera angle. No text, no logos, no watermark, no people.”

| 파일 | 메뉴별 피사체 지시 |
|---|---|
| `carrot-cake-v2.jpg` | 케이크 한 조각과 접시 전체가 잘리지 않도록 중앙에 배치하고, 사방에 여백을 둔 정사각형 구도. 호두 장식, 당근 단면, 크림치즈 층을 선명하게 표현. `carrot-cake-v2-source.png`는 생성 원본. |
| `americano.jpg` | 투명한 잔의 아이스 아메리카노, 깊은 에스프레소와 얼음, 물방울 |
| `cafe-latte.jpg` | 에스프레소가 우유에 섞이는 아이스 카페라떼 |
| `vanilla-latte.jpg` | 바닐라 크림과 에스프레소 층이 보이는 아이스 바닐라라떼 |
| `strawberry-latte.jpg` | 딸기 퓌레와 우유 층, 딸기 과육이 보이는 딸기라떼 |
| `matcha-latte.jpg` | 선명한 녹색 말차와 우유 층이 보이는 아이스 말차라떼 |
| `lemonade.jpg` | 레몬 슬라이스, 얼음, 작은 탄산 기포가 보이는 레몬에이드 |
| `basque-cheesecake.jpg` | 진한 구움색의 윗면과 크리미한 속이 보이는 바스크 치즈케이크 한 조각 |
| `brownie.jpg` | 촉촉하고 진한 단면이 보이는 두툼한 초코 브라우니 |

생성 방식: 내장 `image_gen` 도구. 제품 실물과 다를 수 있으므로 출시 전 실제 사진으로 교체한다.

## 스케치에서 완성 콘셉트로

`assets/cake-before.webp`와 `assets/cake-after.webp`는 제공받은 `Carrot_Cake_Before_After.html`에 포함된 이미지를 분리한 것이다. 당근케이크 소개 영역에서 스케치가 완성 이미지로 바뀌는 모션에 사용한다. 둘 다 발표용 콘셉트 이미지이며 실제 제품 사진이 아니다.

## 공유 미리보기 이미지

`assets/og-card.png`는 1200×630 크기의 Open Graph 이미지다. `assets/og-card-source.png`는 이미지 생성 도구가 만든 원본이다. 새 당근케이크 사진을 참고하여 오른쪽에 케이크 조각과 접시가 모두 보이도록 배치하고 왼쪽에는 아이보리 배경과 문구 `ICON CAFE`, `달콤함은 자연스럽게.`, `제주 구좌 당근케이크`를 넣었다. 작은 공유 미리보기에서도 읽히도록 진한 차콜과 오렌지색의 큰 글자를 사용했다.

