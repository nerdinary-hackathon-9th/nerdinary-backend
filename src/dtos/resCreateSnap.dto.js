export const createSnapDTO = (body) => {
    return {
        title: String(body.title),
        content: String(body.content)
    };
};

export function isCreateSnapDTO(dto) {
    if (!dto || typeof dto !== 'object') return false;
    if (dto.title && typeof dto.title !== 'string') return false;
    if (dto.content && typeof dto.content !== 'string') return false;
    return true;
}