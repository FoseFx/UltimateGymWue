import { ExtractStyleTagsPipe } from './extract-style-tags.pipe';

describe('ExtractStyleTagsPipe', () => {
  it('create an instance', () => {
    const pipe = new ExtractStyleTagsPipe();
    expect(pipe).toBeTruthy();
  });
  it('should detect b tag', () => {
    const pipe = new ExtractStyleTagsPipe();
    expect(pipe.transform('<b><b>test</b></b>')).toContain('bold');
    expect(pipe.transform('<i><b>test</b></i>')).toContain('bold');
    expect(pipe.transform('<i><i>test</i></i>')).not.toContain('bold');
    expect(pipe.transform('test')).not.toContain('bold');
  });

});
