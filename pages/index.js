import {useState} from "react";

export default function Home() {

	const [loading, setLoading] = useState(false)
	const [query, setQuery] = useState('')
	const [result, setResult] = useState(false)
	const [error, setError] = useState(false)

	const submitHandle = e => {
		e.preventDefault()
		setLoading(true)
		fetch('/api/generate-regex', {
			method: 'post',
			body: JSON.stringify({
				query
			})
		})
			.then(res => res.json())
			.then(res => {
				if (res?.error) {
					setError('Regex deseni üretemiyorum, doğru bir şey istediğinden emin misin? LAN.')
					setResult(false)
				} else {
					setResult(res)
					setError(false)
				}
				setQuery('')
			})
			.finally(() => setLoading(false))
	}

	return (
		<div className="container mx-auto my-6">
			<header className="border-b pb-6 mb-6 flex items-center justify-between">
				<div>
					<h6 className="flex items-center gap-x-2 text-xl font-bold">
						REGEX<span className="bg-yellow-500 rounded-md px-4 py-1 text-black">HUB</span>
					</h6>
					<p className="text-base font-medium text-zinc-600 mt-2">
						İhtiyacınız olan regex üretim aracı!
					</p>
				</div>

				<form onSubmit={submitHandle} className="flex gap-x-4">
					<textarea
						value={query}
						onChange={e => setQuery(e.target.value)}
						placeholder="Nasıl bir desene ihtiyacın var?"
						className="h-[100px] w-[400px] bg-zinc-100 outline-none focus:bg-zinc-200 p-4 resize-none rounded-md text-[15px] font-medium"
					/>
					<button
						disabled={!query || loading}
						className="h-10 px-5 rounded-md bg-yellow-500 text-white text-sm font-medium disabled:opacity-50 disabled:pointer-events-none">
						{loading ? '...' : 'ÜRET'}
					</button>
				</form>

			</header>

			{error && (
				<div className="bg-red-500 text-white p-4 rounded-md text-[15px] text-center">
					{error}
				</div>
			)}

			{result && (
				<div>
					<h1 className="text-2xl font-medium text-zinc-400 mb-4">{result.description}</h1>
					<div className="bg-black text-white rounded-md mb-6">
						<h6 className="pt-4 pl-4 font-medium text-xs text-zinc-500">Regex Deseni</h6>
						<pre className="font-mono p-4">{result.pattern}</pre>
					</div>

					<h3 className="text-xl font-bold mb-3">Örnek Kullanımı</h3>

					<pre className="bg-black p-4 rounded-md font-mono text-white text-[15px]">{result.example}</pre>
				</div>
			)}

		</div>
	)
}
