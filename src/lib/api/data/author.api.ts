export const createAuthorAPI = (http: {
	post: <T>(path: string, params?: string) => Promise<T>;
}) => {
	return {
		postAuthor(name: string) {
			return http.post<string>(`/data/author/`, name);
		}
	};
};
