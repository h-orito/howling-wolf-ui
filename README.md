# Wolf for busy

## Overview

- 忙しい人のためのオプションルールを盛り込んだ人狼がプレイできるサイトです

- Vue.js で画面 UI を提供します

- API は[wolf4busy-api](https://github.com/h-orito/wolf4busy-api)を参照

## Requirement for local development

- npm

  - 最新版をインストールしてください

- [wolf4busy-api](https://github.com/h-orito/wolf4busy-api) のセットアップもしておいてください

## Setup for local development

- clone

  - 好きな場所にこのプロジェクトを clone してください

- 起動

  ```
  npm ci
  npm run dev
  ```

  - http://localhost:3000/ が画面 URL になります

- [wolf4busy-api](https://github.com/h-orito/wolf4busy-api) を起動しておいてください

## Contribution

- こんな感じでお願いします

```
1. Fork it
2. Create a feature branch from develop ( e.g. feature/my-new-feature )
3. Implement your changes
4. Run JUnit test (please implement) and confirm that it passes
5. Commit your changes
6. Rebase your local changes against the develop branch
7. Create new Pull Request
```

- ブランチ名は`feature/{変更内容}`でお願いします。
  - Issue と紐づく場合は`#{Issue番号}`を含めてください。 e.g. `feature/valid_password#1`

## License

- MIT License

## Author

- [h-orito](https://github.com/h-orito/)
