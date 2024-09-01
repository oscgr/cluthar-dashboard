import { useI18n } from 'vue-i18n'
import type { AxiosError } from 'axios'
import type { FastifyError } from 'fastify'

export default function useErrorHandler() {
  const { t, te } = useI18n()
  const handleErrorTranslation = (error?: AxiosError<FastifyError>): string => {
    if (error?.status && te(`error.statusCode.${error.status}`))
      return t(`error.statusCode.${error.status}`)
    return t('error.undefined')
  }

  return {
    handleErrorTranslation,
  }
}
