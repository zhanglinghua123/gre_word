
function getDaysDiff(date1: Date, date2: Date): number {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
}
function isNeedReview(Data1:Data): boolean {

}

  // 示例用法
  const date1 = new Date('2022-01-01');
  const date2 = new Date('2022-01-10');
  const daysDiff = getDaysDiff(date1, date2);
  console.log(daysDiff); // 输出 9
  