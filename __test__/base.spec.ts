describe("This kit testing basic jest configuration. If you have failed here, check for project setting", () => {
    let a = 3;
    async function getThree() {
        return 3;
    }
    beforeEach(() => {
        a = 3;
    });
    it('check for 3 is 3', () => {
        expect(3).toBe(3);
    });
    test('check sum', () => {
        a += a;
        expect(a).toBe(6);
    });
    test('check before all is working', () => {
        expect(a).toBe(3);
    });
    test('check async', async () => {
        expect(a + (await getThree())).toBe(6);
    });
});