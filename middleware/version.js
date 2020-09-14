const version = 29

export default async function({ app }) {
  const expectedVersion = await app.$axios.$get('/version')
  if (expectedVersion.client_version > version) {
    if (
      window.confirm(
        '新しいバージョンが配信されているため最新バージョンに更新します。'
      )
    ) {
      location.reload(true)
    }
  }
}
