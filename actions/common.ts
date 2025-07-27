"use server"

//共通のAPIリクエスト
// ----------------------------------
// 引数
// ----------------------------------
// url(文字型)
// options(RequestInit)
// TypeScriptは「変数名: 型名」で宣言
// ----------------------------------
// 戻り値
// ----------------------------------
// success: true or false
// data: Retail
// error: エラーの場合、エラーメッセージ
// ----------------------------------
export const fetchAPI = async (url: string, options: RequestInit) => {
    // .envファイルからbackendのURL取得
    const apiUrl = process.env.API_URL
    if (!apiUrl) {
        return {success: false, error: "API_URLが設定されていません"}
    }

    try {
        console.log(`${apiUrl}${url}`)
        console.log(options)
        // APIをたたく
        // 標準で用意されているfetch関数
        const response = await fetch(`${apiUrl}${url}`, options)
        console.log(response.ok)
        console.log(response.status)
        
        if (!response.ok) {
            const data = await response.json()
            return {success: false, error: "APIでエラーが発生しました", data}
        }

        // Content-Typeが「application/json」の場合のみ、JSONを返す
        const contentType = response.headers.get("Content-Type")
        console.log(contentType)
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json()
            return {success: true, data}
        }
        // 他の場合データなしで成功を返す
        return {success:true}
    } catch (error) {
        console.error(error)
        return {success: false, error: "ネットワークエラーが発生しました"}
    }
}